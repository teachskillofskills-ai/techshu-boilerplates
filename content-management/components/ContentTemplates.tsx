'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { RichContentEditor } from '@/components/editor/RichContentEditor'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Layout, Plus, Edit, Trash2, Copy, Save, X, FileText, Zap } from 'lucide-react'

interface ContentTemplatesProps {
  userId: string
}

interface ContentTemplate {
  id?: string
  name: string
  description: string | null
  template_type: string
  content: string | null
  metadata?: any | null
  is_active: boolean
  created_by: string
  created_at?: string
  updated_at?: string
}

const templateTypes = [
  'introduction',
  'lesson',
  'exercise',
  'summary',
  'assessment',
  'project',
  'other',
]

const defaultTemplates = [
  {
    name: 'Lesson Introduction',
    description: 'Standard template for introducing a new lesson',
    template_type: 'introduction',
    content: `<h2>Welcome to [Lesson Title]</h2>
<p>In this lesson, you will learn:</p>
<ul>
  <li>Key concept 1</li>
  <li>Key concept 2</li>
  <li>Key concept 3</li>
</ul>
<h3>Prerequisites</h3>
<p>Before starting this lesson, make sure you have:</p>
<ul>
  <li>Completed previous lessons</li>
  <li>Basic understanding of...</li>
</ul>
<h3>Learning Objectives</h3>
<p>By the end of this lesson, you will be able to:</p>
<ol>
  <li>Objective 1</li>
  <li>Objective 2</li>
  <li>Objective 3</li>
</ol>`,
  },
  {
    name: 'Practical Exercise',
    description: 'Template for hands-on exercises and activities',
    template_type: 'exercise',
    content: `<h2>Practical Exercise: [Exercise Title]</h2>
<h3>Objective</h3>
<p>In this exercise, you will...</p>
<h3>Instructions</h3>
<ol>
  <li>Step 1: Description</li>
  <li>Step 2: Description</li>
  <li>Step 3: Description</li>
</ol>
<h3>Expected Outcome</h3>
<p>After completing this exercise, you should have...</p>
<h3>Troubleshooting</h3>
<p>If you encounter issues:</p>
<ul>
  <li>Common issue 1 - Solution</li>
  <li>Common issue 2 - Solution</li>
</ul>`,
  },
  {
    name: 'Chapter Summary',
    description: 'Template for summarizing chapter content',
    template_type: 'summary',
    content: `<h2>Chapter Summary</h2>
<h3>Key Takeaways</h3>
<ul>
  <li>Important point 1</li>
  <li>Important point 2</li>
  <li>Important point 3</li>
</ul>
<h3>What You've Learned</h3>
<p>In this chapter, we covered:</p>
<ol>
  <li>Topic 1 and its applications</li>
  <li>Topic 2 and best practices</li>
  <li>Topic 3 and common pitfalls</li>
</ol>
<h3>Next Steps</h3>
<p>In the next chapter, we will explore...</p>`,
  },
]

export function ContentTemplates({ userId }: ContentTemplatesProps) {
  const [templates, setTemplates] = useState<ContentTemplate[]>([])
  const [editingTemplate, setEditingTemplate] = useState<ContentTemplate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('all')

  const supabase = createClient()

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('content_templates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setTemplates(data || [])
    } catch (error) {
      console.error('Error loading templates:', error)
      toast.error('Failed to load templates')
      // Fallback to default templates if database fails
      setTemplates(
        defaultTemplates.map((template, index) => ({
          ...template,
          id: `default-${index}`,
          is_active: true,
          created_by: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }))
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTemplate = () => {
    setEditingTemplate({
      name: '',
      description: '',
      template_type: 'other',
      content: '',
      is_active: true,
      created_by: userId,
    })
  }

  const handleEditTemplate = (template: ContentTemplate) => {
    setEditingTemplate({ ...template })
  }

  const handleSaveTemplate = async () => {
    if (!editingTemplate) return

    if (!editingTemplate.name.trim()) {
      toast.error('Please enter a template name')
      return
    }

    setIsSaving(true)
    try {
      if (editingTemplate.id && !editingTemplate.id.startsWith('default-')) {
        // Update existing template
        const { error } = await supabase
          .from('content_templates')
          .update({
            name: editingTemplate.name,
            description: editingTemplate.description,
            content: editingTemplate.content,
            template_type: editingTemplate.template_type,
            is_active: editingTemplate.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingTemplate.id)

        if (error) throw error
        toast.success('Template updated successfully!')
      } else {
        // Create new template
        const { data, error } = await supabase
          .from('content_templates')
          .insert({
            name: editingTemplate.name,
            description: editingTemplate.description,
            content: editingTemplate.content,
            template_type: editingTemplate.template_type,
            is_active: editingTemplate.is_active,
            created_by: userId,
          })
          .select()
          .single()

        if (error) throw error
        toast.success('Template created successfully!')
      }

      setEditingTemplate(null)
      loadTemplates() // Reload templates from database
    } catch (error) {
      console.error('Error saving template:', error)
      toast.error('Failed to save template')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      if (templateId.startsWith('default-')) {
        toast.error('Cannot delete default templates')
        return
      }

      const { error } = await supabase.from('content_templates').delete().eq('id', templateId)

      if (error) throw error

      toast.success('Template deleted successfully!')
      loadTemplates() // Reload templates from database
    } catch (error) {
      console.error('Error deleting template:', error)
      toast.error('Failed to delete template')
    }
  }

  const handleCopyTemplate = (template: ContentTemplate) => {
    navigator.clipboard.writeText(template.content || '')
    toast.success('Template content copied to clipboard!')
  }

  const filteredTemplates = templates.filter(
    template =>
      selectedType === 'all' || (template.template_type && template.template_type === selectedType)
  )

  if (editingTemplate) {
    return (
      <div className="space-y-6">
        {/* Edit Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              {editingTemplate.id ? 'Edit Template' : 'Create New Template'}
            </h3>
            <p className="text-sm text-gray-600">
              Create reusable content templates for consistent course structure
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setEditingTemplate(null)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Template'}
            </Button>
          </div>
        </div>

        {/* Edit Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Settings */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Template Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={editingTemplate.name}
                    onChange={e =>
                      setEditingTemplate(prev => (prev ? { ...prev, name: e.target.value } : null))
                    }
                    placeholder="e.g., Lesson Introduction"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="template-description">Description</Label>
                  <Textarea
                    id="template-description"
                    value={editingTemplate.description || ''}
                    onChange={e =>
                      setEditingTemplate(prev =>
                        prev ? { ...prev, description: e.target.value } : null
                      )
                    }
                    placeholder="Brief description of when to use this template"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="template-type">Template Type</Label>
                  <select
                    id="template-type"
                    value={editingTemplate.template_type}
                    onChange={e =>
                      setEditingTemplate(prev =>
                        prev ? { ...prev, template_type: e.target.value } : null
                      )
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {templateTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="template-active"
                    checked={editingTemplate.is_active}
                    onChange={e =>
                      setEditingTemplate(prev =>
                        prev ? { ...prev, is_active: e.target.checked } : null
                      )
                    }
                    className="rounded"
                  />
                  <Label htmlFor="template-active">Template is active</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Editor */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Template Content</CardTitle>
                <CardDescription>
                  Design your template content. Use placeholders like [Title] for dynamic content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RichContentEditor
                  content={editingTemplate.content || ''}
                  onChange={content =>
                    setEditingTemplate(prev => (prev ? { ...prev, content } : null))
                  }
                  placeholder="Create your template content here..."
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Content Templates</h3>
          <p className="text-sm text-gray-600">
            Manage reusable content templates for consistent course structure
          </p>
        </div>
        <Button onClick={handleCreateTemplate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Type Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Label>Filter by Type:</Label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {templateTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            <Badge variant="secondary">{filteredTemplates.length} templates</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map(template => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Template Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {template.template_type
                        ? template.template_type.charAt(0).toUpperCase() +
                          template.template_type.slice(1)
                        : 'Template'}
                    </Badge>
                  </div>

                  {/* Content Preview */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div
                      className="prose prose-sm max-w-none text-xs line-clamp-4"
                      dangerouslySetInnerHTML={{
                        __html: (template.content || '').substring(0, 200) + '...',
                      }}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      {template.is_active && (
                        <Badge variant="secondary" className="text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyTemplate(template)}
                        title="Copy content"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTemplate(template)}
                        title="Edit template"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!template.id?.startsWith('default-') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id!)}
                          title="Delete template"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredTemplates.length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Layout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600 mb-4">
                {selectedType === 'all'
                  ? 'Create your first content template to get started.'
                  : `No templates found in the ${selectedType} type.`}
              </p>
              <Button onClick={handleCreateTemplate}>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
