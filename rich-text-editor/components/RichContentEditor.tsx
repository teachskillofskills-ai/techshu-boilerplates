'use client'

import { useState, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import TextAlign from '@tiptap/extension-text-align'
import UnderlineExtension from '@tiptap/extension-underline'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Highlight from '@tiptap/extension-highlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Youtube from '@tiptap/extension-youtube'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
// FontSize extension not available
import { createLowlight } from 'lowlight'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import css from 'highlight.js/lib/languages/css'
import html from 'highlight.js/lib/languages/xml'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { AudioEmbed } from './extensions/AudioEmbed'
import { MermaidDiagram, mermaidTemplates } from './extensions/MermaidDiagram'
import { FileAttachment } from './extensions/FileAttachment'
import { VideoEmbed } from './extensions/VideoEmbed'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Undo,
  Redo,
  Palette,
  Highlighter,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Music,
  FileText,
  Calculator,
  Zap,
  Download,
  Mic,
  Video,
  Play,
  BarChart3,
  Shapes,
  PaintBucket,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Simplified editor without complex extensions for now

interface RichContentEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
  editable?: boolean
}

export function RichContentEditor({
  content = '',
  onChange,
  placeholder = 'Start writing your content...',
  className,
  editable = true,
}: RichContentEditorProps) {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)

  // Initialize lowlight with languages
  const lowlight = createLowlight()
  lowlight.register('javascript', javascript)
  lowlight.register('typescript', typescript)
  lowlight.register('python', python)
  lowlight.register('css', css)
  lowlight.register('html', html)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        codeBlock: false, // We'll use CodeBlockLowlight instead
      }),

      // Text Styling Extensions
      TextStyle, // Required for color and font extensions
      UnderlineExtension,
      Subscript,
      Superscript,
      Highlight.configure({
        multicolor: true,
      }),
      Color.configure({
        types: ['textStyle'],
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      // FontSize extension not available

      // Text alignment
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),

      // Code blocks with syntax highlighting
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'javascript',
      }),

      // Media Extensions
      Youtube.configure({
        width: 640,
        height: 480,
        ccLanguage: 'en',
        interfaceLanguage: 'en',
      }),
      VideoEmbed,
      AudioEmbed,

      // Mathematical expressions (placeholder for future implementation)
      // Mathematics.configure({
      //   HTMLAttributes: {
      //     class: 'math-expression',
      //   },
      //   katexOptions: {
      //     throwOnError: false,
      //   },
      // }),

      // Tables
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,

      // Custom Extensions
      MermaidDiagram,
      FileAttachment,

      // Images
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),

      // Links
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary hover:text-primary/80 underline',
        },
      }),

      // Placeholder
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:')
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const addLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('Enter URL:', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addYouTube = useCallback(() => {
    const url = window.prompt('Enter YouTube URL:')
    if (url) {
      editor?.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      })
    }
  }, [editor])

  const addVideoEmbed = useCallback(() => {
    ;(editor?.commands as any).setVideoEmbed({
      src: '',
      platform: '',
      videoId: '',
      width: 640,
      height: 360,
      title: '',
      autoplay: false,
      controls: true,
    })
  }, [editor])

  const addAudio = useCallback(() => {
    const url = window.prompt(
      'Enter audio URL (Spotify, SoundCloud, Apple Podcasts, or direct audio file):'
    )
    if (url) {
      editor?.commands.setAudioEmbed({ src: url })
    }
  }, [editor])

  const addMath = useCallback(() => {
    const formula = window.prompt('Enter mathematical formula (e.g., E = mc²):')
    if (formula) {
      editor?.commands.insertContent(
        `<span class="math-formula" style="font-family: 'Times New Roman', serif; font-style: italic; background: #f0f9ff; padding: 2px 6px; border-radius: 4px; border: 1px solid #0ea5e9;">${formula}</span>`
      )
    }
  }, [editor])

  const addMermaidDiagram = useCallback(() => {
    const diagramType = window.prompt(
      'Enter diagram type (flowchart, sequence, gantt, pie, mindmap):'
    )
    const template =
      mermaidTemplates[diagramType as keyof typeof mermaidTemplates] || mermaidTemplates.flowchart
    editor?.commands.setMermaidDiagram({ code: template })
  }, [editor])

  const addFileAttachment = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar'
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // In a real app, you'd upload the file to your server first
        const url = URL.createObjectURL(file)
        editor?.commands.setFileAttachment({
          src: url,
          name: file.name,
          size: file.size,
          type: file.type,
        })
      }
    }
    input.click()
  }, [editor])

  const addTable = useCallback(() => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }, [editor])

  const addCodeBlock = useCallback(() => {
    const language =
      window.prompt('Enter programming language (javascript, python, css, html, typescript):') ||
      'javascript'
    editor?.chain().focus().toggleCodeBlock({ language }).run()
  }, [editor])

  const setTextColor = useCallback(
    (color: string) => {
      editor?.chain().focus().setColor(color).run()
    },
    [editor]
  )

  const setFontFamily = useCallback(
    (font: string) => {
      editor?.chain().focus().setFontFamily(font).run()
    },
    [editor]
  )

  // FontSize functionality not available

  if (!editor) {
    return null
  }

  return (
    <div className={cn('border rounded-lg overflow-hidden', className)}>
      {/* Advanced Toolbar */}
      <div className="border-b bg-gray-50 p-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Font Controls */}
          <div className="flex items-center gap-1">
            <Select onValueChange={setFontFamily}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue placeholder="Font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Times New Roman">Times</SelectItem>
                <SelectItem value="Courier New">Courier</SelectItem>
                <SelectItem value="Helvetica">Helvetica</SelectItem>
              </SelectContent>
            </Select>

            {/* Font size selector removed - extension not available */}

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" title="Text Color">
                  <PaintBucket className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="grid grid-cols-6 gap-2">
                  {[
                    '#000000',
                    '#dc2626',
                    '#ea580c',
                    '#ca8a04',
                    '#16a34a',
                    '#2563eb',
                    '#9333ea',
                    '#c2410c',
                  ].map(color => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded border-2 border-border hover:border-border/60"
                      style={{ backgroundColor: color }}
                      onClick={() => setTextColor(color)}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Text Formatting */}
          <div className="flex items-center gap-1">
            <Button
              variant={editor.isActive('bold') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive('italic') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive('underline') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              title="Underline"
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive('strike') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive('highlight') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              title="Highlight"
            >
              <Highlighter className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive('code') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleCode().run()}
              title="Inline Code"
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Subscript/Superscript */}
          <div className="flex items-center gap-1">
            <Button
              variant={editor.isActive('subscript') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              title="Subscript"
            >
              <Type className="h-4 w-4" />
              <span className="text-xs">₂</span>
            </Button>
            <Button
              variant={editor.isActive('superscript') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              title="Superscript"
            >
              <Type className="h-4 w-4" />
              <span className="text-xs">²</span>
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Headings */}
          <div className="flex items-center gap-1">
            <Button
              variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              <Heading3 className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Lists */}
          <div className="flex items-center gap-1">
            <Button
              variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Text Alignment */}
          <div className="flex items-center gap-1">
            <Button
              variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Media & Advanced */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={addImage} title="Insert Image">
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={addLink} title="Insert Link">
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={addYouTube} title="Insert YouTube Video">
              <Video className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={addVideoEmbed}
              title="Insert Video (YouTube, Vimeo, Loom, Wistia, Twitch, Dailymotion)"
            >
              <Play className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={addAudio}
              title="Insert Audio (Spotify, SoundCloud, Podcasts)"
            >
              <Music className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="sm" onClick={addTable} title="Insert Table">
              <TableIcon className="h-4 w-4" />
            </Button>

            <Button
              variant={editor.isActive('codeBlock') ? 'default' : 'ghost'}
              size="sm"
              onClick={addCodeBlock}
              title="Code Block with Syntax Highlighting"
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Advanced Tools */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={addMath} title="Insert Math Formula (LaTeX)">
              <Calculator className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={addMermaidDiagram}
              title="Insert Diagram (Flowchart, Sequence, etc.)"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={addFileAttachment}
              title="Attach File (PDF, DOC, XLS, etc.)"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Media & Links */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={addImage}>
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive('link') ? 'default' : 'ghost'}
              size="sm"
              onClick={addLink}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* AI Assistant */}
          <Button
            variant={isAIAssistantOpen ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
          >
            <Sparkles className="h-4 w-4 mr-1" />
            AI Assistant
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none p-4 min-h-[300px] focus:outline-none"
        />

        {/* AI Assistant Panel */}
        {isAIAssistantOpen && (
          <div className="absolute top-0 right-0 w-80 h-full bg-white border-l shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">AI Writing Assistant</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsAIAssistantOpen(false)}>
                ×
              </Button>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  // AI functionality would be implemented here
                  editor
                    .chain()
                    .focus()
                    .insertContent('AI-generated content would appear here...')
                    .run()
                }}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Improve Writing
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  editor.chain().focus().insertContent('AI summary would appear here...').run()
                }}
              >
                <Type className="h-4 w-4 mr-2" />
                Summarize
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  editor
                    .chain()
                    .focus()
                    .insertContent('AI-generated outline would appear here...')
                    .run()
                }}
              >
                <List className="h-4 w-4 mr-2" />
                Create Outline
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  editor
                    .chain()
                    .focus()
                    .insertContent('AI-generated key points would appear here...')
                    .run()
                }}
              >
                <Quote className="h-4 w-4 mr-2" />
                Extract Key Points
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  editor
                    .chain()
                    .focus()
                    .insertContent('AI grammar check would appear here...')
                    .run()
                }}
              >
                <Code className="h-4 w-4 mr-2" />
                Check Grammar
              </Button>
            </div>

            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => {
                    editor
                      .chain()
                      .focus()
                      .insertContent(
                        '<h2>Introduction</h2><p>Start writing your introduction here...</p>'
                      )
                      .run()
                  }}
                >
                  Add Introduction
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => {
                    editor
                      .chain()
                      .focus()
                      .insertContent('<h2>Conclusion</h2><p>Summarize your main points here...</p>')
                      .run()
                  }}
                >
                  Add Conclusion
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => {
                    editor
                      .chain()
                      .focus()
                      .insertContent(
                        '<blockquote><p>Add an inspiring quote here...</p></blockquote>'
                      )
                      .run()
                  }}
                >
                  Add Quote
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
