# Quick Start - Utiliser le Backend

## 📌 Import Rapide

```typescript
// Tout importer depuis un seul endroit
import {
  // Types
  PromptOutput,
  ApiKeyOutput,
  ApiResponse,
  
  // Server Actions
  createPromptAction,
  listPromptsAction,
  deletePromptAction,
  createApiKeyAction,
  listApiKeysAction,
  
  // Public Templates (no auth needed)
  listTemplatesAction,
  getTemplateBySlugAction,
  
  // Utils
  isSuccessResponse,
  isErrorResponse,
} from '@/lib/backend'
```

## 🚀 Exemples Rapides

### Créer un Prompt
```typescript
'use client'
import { createPromptAction, isSuccessResponse } from '@/lib/backend'

const response = await createPromptAction({
  title: 'Mon Prompt',
  content: 'Contenu...',
})

if (isSuccessResponse(response)) {
  console.log(response.data) // PromptOutput
}
```

### Lister les Prompts
```typescript
'use client'
import { listPromptsAction, isSuccessResponse } from '@/lib/backend'

const response = await listPromptsAction()

if (isSuccessResponse(response)) {
  response.data.forEach(prompt => console.log(prompt.title))
}
```

### Supprimer un Prompt
```typescript
'use client'
import { deletePromptAction } from '@/lib/backend'

const response = await deletePromptAction(promptId)

if (isSuccessResponse(response)) {
  toast.success('Supprimé!')
}
```

### Gérer les API Keys
```typescript
'use client'
import {
  createApiKeyAction,
  listApiKeysAction,
  updateApiKeyAction,
  deleteApiKeyAction,
  isSuccessResponse,
} from '@/lib/backend'

// Créer
const createResp = await createApiKeyAction({
  name: 'Ma clé',
  provider: 'openai',
})

// Lister
const listResp = await listApiKeysAction()

// Mettre à jour
const updateResp = await updateApiKeyAction(keyId, {
  enabled: false,
})

// Supprimer
const deleteResp = await deleteApiKeyAction(keyId)
```

### Accéder aux Templates (PUBLIC)
```typescript
'use client'
import { listTemplatesAction, getTemplateBySlugAction, isSuccessResponse } from '@/lib/backend'

// Pas d'authentification requise!
const response = await listTemplatesAction()

if (isSuccessResponse(response)) {
  response.data.forEach(template => {
    console.log(template.name, template.description)
  })
}

// Ou par slug
const resp = await getTemplateBySlugAction('my-template')
```

## 📊 Type Safety

```typescript
// Les réponses sont typées!
const response = await listPromptsAction()

if (isSuccessResponse(response)) {
  // response.data est PromptOutput[]
  response.data[0].title // ✅ OK
  response.data[0].invalid // ❌ ERROR - TypeScript!
} else {
  // response.error existe!
  response.error.message // ✅ OK
}
```

## 🔍 Gestion d'Erreurs

```typescript
import { isSuccessResponse, isErrorResponse } from '@/lib/backend'

const response = await createPromptAction(data)

if (isSuccessResponse(response)) {
  // Success - response.data disponible
  console.log('Créé:', response.data)
} else if (isErrorResponse(response)) {
  // Error - response.error disponible
  console.log('Erreur:', response.error.code) // 'UNAUTHORIZED', 'FORBIDDEN', etc
  console.log('Message:', response.error.message)
}
```

## 💡 Cas Courants

### Charger les données au mount
```typescript
'use client'
import { useEffect, useState } from 'react'
import { listPromptsAction, isSuccessResponse, PromptOutput } from '@/lib/backend'

export function PromptsList() {
  const [prompts, setPrompts] = useState<PromptOutput[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const response = await listPromptsAction()
      if (isSuccessResponse(response)) {
        setPrompts(response.data)
      }
      setLoading(false)
    })()
  }, [])

  return (
    <div>
      {loading && 'Chargement...'}
      {prompts.map(p => <div key={p.id}>{p.title}</div>)}
    </div>
  )
}
```

### Form avec validation
```typescript
'use client'
import { createPromptAction, isSuccessResponse } from '@/lib/backend'
import { toast } from 'sonner'

export function CreateForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const response = await createPromptAction({ title, content })

    if (isSuccessResponse(response)) {
      toast.success('Créé!')
      setTitle('')
      setContent('')
    } else {
      toast.error(response.error?.message || 'Erreur')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button disabled={loading}>{loading ? 'Création...' : 'Créer'}</button>
    </form>
  )
}
```

### List avec suppression
```typescript
'use client'
import { deletePromptAction, isSuccessResponse, PromptOutput } from '@/lib/backend'

interface PromptItemProps {
  prompt: PromptOutput
  onDeleted?: () => void
}

export function PromptItem({ prompt, onDeleted }: PromptItemProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    const response = await deletePromptAction(prompt.id)

    if (isSuccessResponse(response)) {
      toast.success('Supprimé!')
      onDeleted?.()
    } else {
      toast.error('Erreur')
    }

    setLoading(false)
  }

  return (
    <div>
      <h3>{prompt.title}</h3>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? 'Suppression...' : 'Supprimer'}
      </button>
    </div>
  )
}
```

## 🔐 Authentification

Tout est géré automatiquement par `requireAuth()` dans les server actions!

- ✅ Si non connecté → `UnauthorizedError` → response.error.code = 'UNAUTHORIZED'
- ✅ Si pas propriétaire → `ForbiddenError` → response.error.code = 'FORBIDDEN'
- ✅ Si données invalides → `ValidationError` → response.error.code = 'VALIDATION_ERROR'

## 📚 Documentation Complète

- `STRUCTURE.md` - Architecture détaillée
- `README.md` - Principes et patterns
- `EXAMPLES.md` - Exemples complets

