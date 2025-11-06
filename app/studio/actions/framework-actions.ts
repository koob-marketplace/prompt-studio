'use server';

import fs from 'fs/promises';
import path from 'path';

export async function getFrameworks() {
  try {
    const frameworkDir = path.join(process.cwd(), 'app', 'studio', 'frameworks');
    const files = await fs.readdir(frameworkDir);
    return files
      .filter((file) => file.endsWith('.json'))
      .map((file) => path.parse(file).name);
  } catch (error) {
    console.error('Failed to read frameworks directory:', error);
    return [];
  }
}

export async function loadFramework(name: string) {
  try {
    const filePath = path.join(
      process.cwd(),
      'app',
      'studio',
      'frameworks',
      `${name}.json`
    );
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Failed to load framework ${name}:`, error);
    return null;
  }
}
