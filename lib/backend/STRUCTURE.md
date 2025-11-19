# Architecture Backend - Structure Complète

## 📁 Arborescence Finale

```
lib/backend/
├── types/
│   ├── errors.ts          # Classes d'erreur custom
│   ├── auth.ts            # Types d'authentification et ApiResponse
│   ├── prompt.ts          # Types Prompt (Input/Output)
│   ├── template.ts        # Types Template (read-only)
│   ├── api-key.ts         # Types API Key (Input/Output)
│   ├── user.ts            # Types User (Output)
│   └── index.ts           # Export central
│
├── validators/
│   ├── prompt.schemas.ts        # Zod schemas Prompt
│   ├── api-key.schemas.ts       # Zod schemas API Key
│   ├── user.schemas.ts          # Zod schemas User
│   ├── common.schemas.ts        # Zod schemas communs (pagination)
│   └── index.ts                 # Export central
│
├── guards/
│   └── index.ts           # Auth & Permission guards
│                           # - requireAuth()
│                           # - requirePromptOwnership()
│                           # - requireApiKeyOwnership()
│
├── repositories/
│   ├── prompt.repository.ts      # CRUD Prompt
│   ├── template.repository.ts    # GET (read-only) Template
│   ├── user.repository.ts        # GET User
│   ├── api-key.repository.ts     # CRUD API Key
│   └── index.ts                  # Export central
│
├── services/
│   ├── prompt.service.ts         # Business logic Prompt
│   ├── template.service.ts       # Business logic Template
│   ├── user.service.ts           # Business logic User
│   ├── api-key.service.ts        # Business logic API Key
│   └── index.ts                  # Export central
│
├── actions/
│   ├── prompt.actions.ts         # Server actions Prompt
│   ├── template.actions.ts       # Server actions Template (PUBLIC)
│   ├── user.actions.ts           # Server actions User
│   ├── api-key.actions.ts        # Server actions API Key
│   └── index.ts                  # Export central
│
├── utils/
│   ├── error.utils.ts            # handleError() - centralise error handling
│   ├── response.utils.ts         # isSuccessResponse(), isErrorResponse()
│   └── index.ts                  # Export central
│
├── README.md              # Documentation complète
├── STRUCTURE.md           # Ce fichier
└── index.ts              # Main export file
```

## 🔄 Flux de Données (End-to-End)

```
┌─────────────────────────────┐
│  React Component ('use client') │ ← utilisateur clique
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Server Action              │ ← createPromptAction()
│  (lib/backend/actions/*)    │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  VALIDATION LAYER           │ ← validators.createPromptSchema.parse()
│  (Zod Schemas)              │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  AUTH GUARD                 │ ← requireAuth()
│  (lib/backend/guards/)      │ THROWS: UnauthorizedError
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  PERMISSION GUARD           │ ← requirePromptOwnership()
│  (lib/backend/guards/)      │ THROWS: ForbiddenError
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  SERVICE LAYER              │ ← promptService.createPrompt()
│  (lib/backend/services/*)   │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  REPOSITORY LAYER           │ ← promptRepository.createPrompt()
│  (lib/backend/repositories/)│
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  DATABASE                   │ ← Supabase
│  (PostgreSQL via Supabase)  │
└──────────────┬──────────────┘
               │
               ▼ (Response mappé)
┌─────────────────────────────┐
│  ApiResponse<PromptOutput>  │ ← { success: true, data: {...} }
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  React Component            │ ← isSuccessResponse(response)
│  (use client)               │ Affiche le résultat
└─────────────────────────────┘
```

## 📦 Exemple Complet: Créer un Prompt

### 1️⃣ Types (`lib/backend/types/prompt.ts`)
```typescript
interface CreatePromptInput {
  title: string
  content: string
  configuration?: Record<string, unknown>
}

interface PromptOutput {
  id: string
  userId: string
  title: string
  content: string
  configuration: Record<string, unknown> | null
  createdAt: Date
  updatedAt: Date
}
```

### 2️⃣ Validator (`lib/backend/validators/prompt.schemas.ts`)
```typescript
const createPromptSchema = z.object({
  title: z.string().min(3).max(255),
  content: z.string().min(1).max(50000),
  configuration: z.record(z.unknown()).optional(),
})
```

### 3️⃣ Repository (`lib/backend/repositories/prompt.repository.ts`)
```typescript
export async function createPrompt(
  userId: string,
  data: CreatePromptInput
): Promise<PromptOutput> {
  // Insert in Supabase
  const prompt = await supabase.from('prompts').insert({...}).single()
  // Map response
  return mapPromptResponse(prompt)
}
```

### 4️⃣ Service (`lib/backend/services/prompt.service.ts`)
```typescript
export async function createPrompt(
  userId: string,
  input: CreatePromptInput
): Promise<PromptOutput> {
  // Business logic can go here (logging, enrichment, etc)
  return promptRepository.createPrompt(userId, input)
}
```

### 5️⃣ Server Action (`lib/backend/actions/prompt.actions.ts`)
```typescript
'use server'

export async function createPromptAction(
  input: CreatePromptInput
): Promise<ApiResponse> {
  try {
    // 1. Authenticate user
    const auth = await requireAuth() // THROWS if not logged in
    
    // 2. Validate input
    const validated = validators.createPromptSchema.parse(input)
    
    // 3. Call service
    const prompt = await promptService.createPrompt(auth.userId, validated)
    
    // 4. Return success response
    return { success: true, data: prompt }
  } catch (error) {
    return handleError(error) // Returns error response
  }
}
```

### 6️⃣ Component Client (`app/dashboard/components/create-prompt.tsx`)
```typescript
'use client'

export function CreatePromptForm() {
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Call server action
    const response = await createPromptAction({
      title: 'Mon Prompt',
      content: 'Contenu...',
    })
    
    // Check response
    if (isSuccessResponse(response)) {
      toast.success('Créé!')
      // response.data is PromptOutput with type safety
    } else {
      toast.error(response.error?.message)
    }
  }
  
  return <form onSubmit={handleSubmit}>{...}</form>
}
```

## 🛡️ Sécurité - Couches de Protection

### ✅ Authentification
- `requireAuth()` - Vérifie que l'utilisateur est connecté
- Lève `UnauthorizedError` si pas authentifié
- **Chaque server action DOIT l'appeler**

### ✅ Autorisation
- `requirePromptOwnership()` - Vérifie que l'utilisateur possède le prompt
- `requireApiKeyOwnership()` - Vérifie que l'utilisateur possède la clé
- Lève `ForbiddenError` si pas propriétaire
- **Appelée dans le service AVANT modification**

### ✅ Validation
- Zod schemas - Valide TOUS les inputs
- Lève `ValidationError` si données invalides
- **Appelée dans le server action APRÈS auth**

### ✅ Isolation des Données
- Les repositories retournent ONLY safe data (jamais passwords)
- Les services ne retournent que des PromptOutput, pas des objets internes
- Les actions ne retournent que ApiResponse typée

### ✅ Error Handling
- Tous les erreurs mappées à AppError ou subclasses
- handleError() centralisé - ne expose JAMAIS internal details
- Client reçoit only public error messages

## 📝 Cas d'Usage Courants

### Case 1: Templates (PUBLIC - sans auth)
```typescript
// N'importe où, même sans login
const response = await listTemplatesAction()
```

### Case 2: Prompts (PRIVATE - with auth + ownership)
```typescript
// Doit être connecté
const response = await createPromptAction(data)

// Doit être connecté + propriétaire
const response = await deletePromptAction(promptId)
```

### Case 3: API Keys (PRIVATE - with auth + ownership)
```typescript
// Doit être connecté
const response = await createApiKeyAction(data)

// Doit être connecté + propriétaire
const response = await updateApiKeyAction(keyId, data)
```

## 🔧 Pattern: Ajouter une Nouvelle Entité

Pour ajouter `Projects`:

### 1. Types: `lib/backend/types/project.ts`
```typescript
export interface CreateProjectInput { ... }
export interface ProjectOutput { ... }
```

### 2. Validators: `lib/backend/validators/project.schemas.ts`
```typescript
export const createProjectSchema = z.object({ ... })
```

### 3. Repository: `lib/backend/repositories/project.repository.ts`
```typescript
export async function createProject(...) { ... }
export async function getProject(...) { ... }
```

### 4. Service: `lib/backend/services/project.service.ts`
```typescript
export async function createProject(...) {
  await requirePermission(userId, 'CREATE_PROJECT')
  return projectRepository.createProject(userId, input)
}
```

### 5. Actions: `lib/backend/actions/project.actions.ts`
```typescript
export async function createProjectAction(input) {
  try {
    const auth = await requireAuth()
    const validated = validators.createProjectSchema.parse(input)
    const result = await projectService.createProject(auth.userId, validated)
    return { success: true, data: result }
  } catch (error) {
    return handleError(error)
  }
}
```

### 6. Update exports
- `lib/backend/types/index.ts` - add `export * from './project'`
- `lib/backend/validators/index.ts` - add `export * from './project.schemas'`
- `lib/backend/repositories/index.ts` - add `export * as projectRepository`
- `lib/backend/services/index.ts` - add `export * as projectService`
- `lib/backend/actions/index.ts` - add `export * from './project.actions'`

## ✨ Avantages de cette Architecture

✅ **Modularité** - Chaque entité a ses propres fichiers  
✅ **Maintenabilité** - Facile de trouver et modifier le code  
✅ **Scalabilité** - Ajouter une nouvelle entité est simple et prévisible  
✅ **Type Safety** - TypeScript tout le long de la chaîne  
✅ **Sécurité** - Authentification et autorisation centralisées  
✅ **Testabilité** - Chaque couche peut être testée indépendamment  
✅ **DRY** - Pas de code dupliqué  
✅ **Clean Code** - Responsabilités bien séparées  

## 🚀 Utilisation dans les Composants

```typescript
'use client'

import { isSuccessResponse } from '@/lib/backend'
import { createPromptAction } from '@/lib/backend/actions'

export function MyComponent() {
  const handleCreate = async () => {
    const response = await createPromptAction({
      title: 'Mon Prompt',
      content: 'Contenu',
    })

    if (isSuccessResponse(response)) {
      console.log('Succès:', response.data)
    } else {
      console.error('Erreur:', response.error?.message)
    }
  }

  return <button onClick={handleCreate}>Créer</button>
}
```

C'est tout! Architecture propre, sécurisée et scalable! 🎉

