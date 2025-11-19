import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

// This is the key that MUST be set in your environment variables.
const key = process.env.ENCRYPTION_KEY;

if (!key) {
  throw new Error('A 32-byte ENCRYPTION_KEY environment variable must be set.');
}

const algorithm = 'aes-256-gcm';
// The salt can be a fixed value, but for better security, it should also be an environment variable.
const salt = process.env.ENCRYPTION_SALT || 'default-salt-for-dev-only';

// Derive a key of the correct length from the master key.
const derivedKey = scryptSync(key, salt, 32);

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * The output format is "iv:authTag:encryptedData", all in hex.
 */
export async function encrypt(text: string): Promise<string> {
  const iv = randomBytes(16);
  const cipher = createCipheriv(algorithm, derivedKey, iv);
  
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Decrypts an encrypted string in the "iv:authTag:encryptedData" format.
 */
export async function decrypt(encryptedText: string): Promise<string> {
  try {
    const [ivHex, authTagHex, encryptedHex] = encryptedText.split(':');
    
    if (!ivHex || !authTagHex || !encryptedHex) {
      throw new Error('Invalid encrypted text format.');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');

    const decipher = createDecipheriv(algorithm, derivedKey, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

    return decrypted.toString('utf8');
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt data.");
  }
}
