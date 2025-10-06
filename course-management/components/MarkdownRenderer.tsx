'use client'

import { useMemo } from 'react'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Simple markdown-to-HTML converter for basic formatting
  const htmlContent = useMemo(() => {
    if (!content) return ''

    let html = content

    // Headers with anchors
    const slugify = (t: string) =>
      t
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    html = html.replace(
      /^### (.*$)/gim,
      (_m, p1) =>
        `<h3 id="${slugify(p1)}" class="scroll-mt-24 text-xl font-semibold text-gray-900 mt-8 mb-4">${p1}</h3>`
    )
    html = html.replace(
      /^## (.*$)/gim,
      (_m, p1) =>
        `<h2 id="${slugify(p1)}" class="scroll-mt-24 text-2xl font-bold text-gray-900 mt-10 mb-6">${p1}</h2>`
    )
    html = html.replace(
      /^# (.*$)/gim,
      (_m, p1) =>
        `<h1 id="${slugify(p1)}" class="scroll-mt-24 text-3xl font-bold text-gray-900 mt-12 mb-8">${p1}</h1>`
    )

    // Bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

    // Code blocks
    html = html.replace(
      /```([\s\S]*?)```/g,
      '<pre class="bg-gray-100 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm">$1</code></pre>'
    )
    html = html.replace(
      /`(.*?)`/g,
      '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>'
    )

    // Lists
    html = html.replace(/^\* (.*$)/gim, '<li class="mb-2">$1</li>')
    html = html.replace(/^- (.*$)/gim, '<li class="mb-2">$1</li>')
    html = html.replace(/^\d+\. (.*$)/gim, '<li class="mb-2">$1</li>')

    // Wrap consecutive list items in ul/ol
    html = html.replace(/(<li class="mb-2">.*<\/li>\s*)+/g, match => {
      return `<ul class="list-disc list-inside space-y-2 my-4 ml-4">${match}</ul>`
    })

    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
    html = `<p class="mb-4 text-gray-700 leading-relaxed">${html}</p>`

    // Clean up empty paragraphs
    html = html.replace(/<p class="mb-4 text-gray-700 leading-relaxed"><\/p>/g, '')

    // Line breaks
    html = html.replace(/\n/g, '<br />')

    return html
  }, [content])

  if (!content) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Available</h3>
        <p className="text-gray-600">This chapter content is being prepared.</p>
      </div>
    )
  }

  return (
    <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />
  )
}
