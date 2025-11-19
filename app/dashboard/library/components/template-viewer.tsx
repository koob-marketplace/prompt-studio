'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  jsonToPromptNodes,
  promptNodesToMarkdown,
  promptNodesToXml,
  promptNodesToToon,
  promptNodesToYaml,
} from '@/lib/utils/transform'
import { CodeView } from '@/app/studio/components/CodeView'

interface TemplateViewerProps {
  jsonData: Record<string, unknown>
}

export function TemplateViewer({ jsonData }: TemplateViewerProps) {
  const nodes = jsonToPromptNodes(jsonData)
  const xmlData = promptNodesToXml(nodes)
  const markdownData = promptNodesToMarkdown(nodes)
  const toonData = promptNodesToToon(nodes)
  const yamlData = promptNodesToYaml(nodes)
  const jsonString = JSON.stringify(jsonData, null, 2)

  return (
    <Tabs defaultValue="json" className="w-full">
      <TabsList>
        <TabsTrigger value="json">JSON</TabsTrigger>
        <TabsTrigger value="markdown">Markdown</TabsTrigger>
        <TabsTrigger value="xml">XML</TabsTrigger>
        <TabsTrigger value="toon">TOON</TabsTrigger>
        <TabsTrigger value="yaml">YAML</TabsTrigger>
      </TabsList>
      <TabsContent value="json">
        <CodeView code={jsonString} language="json" />
      </TabsContent>
      <TabsContent value="markdown">
        <CodeView code={markdownData} language="markdown" />
      </TabsContent>
      <TabsContent value="xml">
        <CodeView code={xmlData} language="xml" />
      </TabsContent>
      <TabsContent value="toon">
        <CodeView code={toonData} language="toon" />
      </TabsContent>
      <TabsContent value="yaml">
        <CodeView code={yamlData} language="yaml" />
      </TabsContent>
      </Tabs>
  )
}
