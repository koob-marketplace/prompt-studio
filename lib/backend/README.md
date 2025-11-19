# Backend Architecture

Couche backend sécurisée et modulaire pour Prompt Studio.

## Structure

```
lib/backend/
├── types/           # Types & interfaces TypeScript
├── validators/      # Zod schemas pour validation
├── guards/          # Authentification & autorisation
├── repositories/    # Data access layer (Supabase)
├── services/        # Business logic
├── actions/         # Server actions (client-facing)
└── utils/           # Utility functions
```

## Flux de Sécurité

```
Component (Client)
    ↓
Server Action (lib/backend/actions/*)
    ↓
Validate Input (Zod)
    ↓
Authenticate User (requireAuth)
    ↓
Verify Ownership (requirePromptOwnership, etc)
    ↓
Service Layer (lib/backend/services/*)
    ↓
Repository Layer (lib/backend/repositories/*)
    ↓
Database (Supabase)
    ↓
Type-safe Response
```

## Usage Examples

### Créer un prompt

```typescript
'use client'

import { createPromptAction } from '@/lib/backend/actions'
import { isSuccessResponse } from '@/lib/backend/utils'

export function CreatePromptButton() {
  const handleCreate = async () => {
    const response = await createPromptAction({
      title: 'Mon Prompt',
      content: 'Contenu du prompt',
      configuration: { model: 'gpt-4' },
    })

    if (isSuccessResponse(response)) {
      console.log('Prompt créé:', response.data)
    } else {
      console.error('Erreur:', response.error?.message)
    }
  }

  return <button onClick={handleCreate}>Créer</button>
}
```

### Récupérer les prompts

```typescript
'use client'

import { listPromptsAction } from '@/lib/backend/actions'

export function PromptsList() {
  const handleFetch = async () => {
    const response = await listPromptsAction()

    if (isSuccessResponse(response)) {
      console.log('Prompts:', response.data)
    }
  }

  return <button onClick={handleFetch}>Charger</button>
}
```

### Récupérer les templates (public)

```typescript
'use client'

import { listTemplatesAction } from '@/lib/backend/actions'

export function TemplatesList() {
  const handleFetch = async () => {
    // Pas d'authentification requise - templates sont publics
    const response = await listTemplatesAction()

    if (isSuccessResponse(response)) {
      console.log('Templates:', response.data)
    }
  }

  return <button onClick={handleFetch}>Charger Templates</button>
}
```

### Gérer des API Keys

```typescript
'use client'

import { createApiKeyAction, listApiKeysAction } from '@/lib/backend/actions'

export function ApiKeysManager() {
  const handleCreate = async () => {
    const response = await createApiKeyAction({
      name: 'Ma clé OpenAI',
      provider: 'openai',
    })

    if (isSuccessResponse(response)) {
      console.log('API Key créée:', response.data)
    }
  }

  const handleList = async () => {
    const response = await listApiKeysAction()

    if (isSuccessResponse(response)) {
      console.log('API Keys:', response.data)
    }
  }

  return (
    <>
      <button onClick={handleCreate}>Créer Clé</button>
      <button onClick={handleList}>Lister Clés</button>
    </>
  )
}
```

## Sécurité

### Authentication
- ✅ `requireAuth()` - Vérifie que l'utilisateur est authentifié
- ✅ Utilisé dans chaque server action nécessitant auth
- ✅ Lève `UnauthorizedError` si non authentifié

### Authorization
- ✅ `requirePromptOwnership()` - Vérifie que l'utilisateur possède le prompt
- ✅ `requireApiKeyOwnership()` - Vérifie que l'utilisateur possède la clé API
- ✅ Lève `ForbiddenError` si pas autorisé

### Validation
- ✅ Zod schemas - Validation stricte des inputs
- ✅ Lève `ValidationError` si données invalides
- ✅ Messages d'erreur descriptifs

### Templates (Public)
- ✅ Pas d'authentification requise
- ✅ Read-only operations seulement
- ✅ Accessible à tous les utilisateurs

## Gestion des Erreurs

Tous les erreurs sont mappées à `ApiResponse`:

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string        // Code d'erreur machine
    message: string     // Message pour l'utilisateur
    details?: unknown   // Données additionnelles
  }
}
```

### Codes d'erreur
- `UNAUTHORIZED` (401) - Authentification requise
- `FORBIDDEN` (403) - Permission refusée
- `NOT_FOUND` (404) - Ressource introuvable
- `VALIDATION_ERROR` (400) - Validation échouée
- `CONFLICT` (409) - Conflit de ressource
- `INTERNAL_ERROR` (500) - Erreur serveur

## Ajouter une Nouvelle Entité

Pour ajouter une nouvelle entité (ex: `Projects`):

### 1. Types (`lib/backend/types/index.ts`)
```typescript
export interface CreateProjectInput {
  name: string
  description: string
}

export interface ProjectOutput {
  id: string
  userId: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
}
```

### 2. Validators (`lib/backend/validators/index.ts`)
```typescript
export const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(1000),
})
```

### 3. Repository (`lib/backend/repositories/index.ts`)
```typescript
export async function createProject(
  userId: string,
  data: CreateProjectInput
): Promise<ProjectOutput> {
  const supabase = await createClient()
  // ... implementation
}
```

### 4. Service (`lib/backend/services/index.ts`)
```typescript
export async function createProject(
  userId: string,
  input: CreateProjectInput
): Promise<ProjectOutput> {
  const validated = validators.createProjectSchema.parse(input)
  const project = await repository.createProject(userId, validated)
  return project
}
```

### 5. Server Action (`lib/backend/actions/index.ts`)
```typescript
export const createProjectAction = createServerAction(
  async (auth, input: CreateProjectInput) => {
    const validated = validators.createProjectSchema.parse(input)
    const project = await services.createProject(auth.userId, validated)
    return project
  }
)
```

## Best Practices

✅ **À FAIRE:**
- Toujours valider les inputs avec Zod
- Toujours vérifier l'authentification
- Vérifier la possession des ressources
- Retourner only safe data
- Utiliser type-safe responses
- Logger les erreurs critiques

❌ **À ÉVITER:**
- Confiance dans les inputs utilisateur
- Exposer les données sensibles
- Queries SQL raw
- Erreurs détaillées au client
- Oublier les vérifications de permission
- Stocker les secrets en plaintext

