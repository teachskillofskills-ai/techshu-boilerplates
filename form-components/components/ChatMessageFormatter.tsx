/**
 * Chat Message Formatter for TechShu SkillHub
 * Formats AI responses for conversational chat interface
 */

'use client'

import React from 'react'
import { ExternalLink } from 'lucide-react'

interface ChatMessageFormatterProps {
  content: string
  isUser?: boolean
  className?: string
}

export function ChatMessageFormatter({
  content,
  isUser = false,
  className = '',
}: ChatMessageFormatterProps) {
  if (isUser) {
    // User messages - simple text formatting
    return <div className={`whitespace-pre-wrap ${className}`}>{content}</div>
  }

  // AI messages - enhanced formatting for conversational chat
  return <div className={`space-y-3 ${className}`}>{formatAIResponse(content)}</div>
}

function formatAIResponse(content: string) {
  // Clean and convert any complex structures to conversational text
  const cleanedContent = makeContentChatFriendly(content)

  // Split content into paragraphs
  const paragraphs = cleanedContent.split('\n\n').filter(p => p.trim())

  return paragraphs
    .map((paragraph, index) => {
      const trimmed = paragraph.trim()

      // Skip empty or very short content
      if (trimmed.length < 3) return null

      // Handle simple bullet points (but limit complexity)
      if ((trimmed.includes('•') || trimmed.includes('- ')) && !isComplexStructure(trimmed)) {
        return <BulletList key={index} content={trimmed} />
      }

      // Handle simple numbered lists (but limit complexity)
      if (/^\d+\./.test(trimmed) && !isComplexStructure(trimmed)) {
        return <NumberedList key={index} content={trimmed} />
      }

      // Handle regular paragraphs with inline formatting
      return <FormattedParagraph key={index} content={trimmed} />
    })
    .filter(Boolean)
}

// Check if content is too complex for chat
function isComplexStructure(content: string): boolean {
  return (
    content.includes('|') || // Tables
    content.includes('---') || // Separators
    content.split('\n').length > 6 || // Too many lines
    content.length > 300 // Too long for a simple list
  )
}

// Make content more chat-friendly
function makeContentChatFriendly(content: string): string {
  return (
    content
      // Convert complex structures to simple text
      .replace(/\|[^|\n]*\|[^|\n]*\|[^\n]*/g, match => {
        // Convert table rows to sentences
        const parts = match
          .split('|')
          .filter(p => p.trim())
          .map(p => p.trim())
        if (parts.length >= 2) {
          return `${parts[0]} involves ${parts.slice(1).join(', ')}.`
        }
        return parts.join(' ')
      })
      // Remove complex formatting
      .replace(/[-=]{3,}/g, '')
      .replace(/\n\s*\|\s*/g, '\n')
      // Simplify excessive bullet points
      .replace(/(\n[•\-]\s*[^\n]*){6,}/g, match => {
        const items = match
          .split('\n')
          .filter(line => line.trim())
          .slice(0, 4)
        return items.join('\n') + '\n\n...and several other important points!'
      })
  )
}

function BulletList({ content }: { content: string }) {
  const items = content
    .split(/\n(?=•|\s*-\s)/)
    .map(item => item.replace(/^[•\-]\s*/, '').trim())
    .filter(item => item)

  return (
    <ul className="space-y-2 ml-4">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <span className="text-pink-500 mr-2 mt-1 text-sm">•</span>
          <span className="flex-1">
            <FormattedText content={item} />
          </span>
        </li>
      ))}
    </ul>
  )
}

function NumberedList({ content }: { content: string }) {
  const items = content
    .split(/\n(?=\d+\.)/)
    .map(item => item.replace(/^\d+\.\s*/, '').trim())
    .filter(item => item)

  return (
    <ol className="space-y-2 ml-4">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <span className="text-pink-500 mr-2 mt-1 text-sm font-medium">{index + 1}.</span>
          <span className="flex-1">
            <FormattedText content={item} />
          </span>
        </li>
      ))}
    </ol>
  )
}

function FormattedParagraph({ content }: { content: string }) {
  return (
    <p className="text-gray-800 leading-relaxed">
      <FormattedText content={content} />
    </p>
  )
}

function FormattedText({ content }: { content: string }) {
  // Process the text for inline formatting
  const parts = processInlineFormatting(content)

  return (
    <>
      {parts.map((part, index) => {
        if (part.type === 'bold') {
          return (
            <strong key={index} className="font-semibold text-gray-900">
              {part.content}
            </strong>
          )
        }

        if (part.type === 'link') {
          return (
            <a
              key={index}
              href={part.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              {part.content}
              <ExternalLink className="h-3 w-3" />
            </a>
          )
        }

        if (part.type === 'code') {
          return (
            <code
              key={index}
              className="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono"
            >
              {part.content}
            </code>
          )
        }

        // Regular text
        return <span key={index}>{part.content}</span>
      })}
    </>
  )
}

interface TextPart {
  type: 'text' | 'bold' | 'link' | 'code'
  content: string
  url?: string
}

function processInlineFormatting(text: string): TextPart[] {
  const parts: TextPart[] = []
  let currentIndex = 0

  // Regex patterns for different formatting
  const patterns = [
    { type: 'bold', regex: /\*\*(.*?)\*\*/g },
    { type: 'link', regex: /\[([^\]]+)\]\(([^)]+)\)/g },
    { type: 'code', regex: /`([^`]+)`/g },
  ]

  // Find all matches
  const matches: Array<{
    type: string
    start: number
    end: number
    content: string
    url?: string
  }> = []

  patterns.forEach(pattern => {
    let match
    const regex = new RegExp(pattern.regex.source, 'g')

    while ((match = regex.exec(text)) !== null) {
      matches.push({
        type: pattern.type,
        start: match.index,
        end: match.index + match[0].length,
        content: match[1],
        url: pattern.type === 'link' ? match[2] : undefined,
      })
    }
  })

  // Sort matches by start position
  matches.sort((a, b) => a.start - b.start)

  // Process text with matches
  matches.forEach(match => {
    // Add text before match
    if (currentIndex < match.start) {
      const textBefore = text.slice(currentIndex, match.start)
      if (textBefore) {
        parts.push({ type: 'text', content: textBefore })
      }
    }

    // Add formatted match
    parts.push({
      type: match.type as any,
      content: match.content,
      url: match.url,
    })

    currentIndex = match.end
  })

  // Add remaining text
  if (currentIndex < text.length) {
    const remainingText = text.slice(currentIndex)
    if (remainingText) {
      parts.push({ type: 'text', content: remainingText })
    }
  }

  // If no matches found, return the whole text as one part
  if (parts.length === 0) {
    parts.push({ type: 'text', content: text })
  }

  return parts
}

// Helper function to detect if content needs special formatting
export function needsSpecialFormatting(content: string): boolean {
  return (
    content.includes('**') ||
    content.includes('[') ||
    content.includes('`') ||
    content.includes('•') ||
    content.includes('- ') ||
    /^\d+\./.test(content.trim())
  )
}

// Helper function to clean up markdown artifacts and convert tables to conversational text
export function cleanMarkdownArtifacts(content: string): string {
  let cleaned = content
    .replace(/^\s*#+\s*/gm, '') // Remove markdown headers
    .replace(/\*\*\*([^*]+)\*\*\*/g, '**$1**') // Convert triple asterisks to double
    .replace(/_{2,}/g, '') // Remove multiple underscores
    .replace(/`{3,}[\w]*\n?/g, '') // Remove code block markers

  // Convert table-like structures to conversational text
  cleaned = convertTablesToConversation(cleaned)

  // Remove excessive formatting artifacts
  cleaned = cleaned
    .replace(/\|+/g, '') // Remove pipe symbols
    .replace(/[-=]{3,}/g, '') // Remove separator lines
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Reduce multiple line breaks
    .trim()

  return cleaned
}

// Convert table-like content to conversational format
function convertTablesToConversation(content: string): string {
  // Detect table patterns with pipes
  const tablePattern = /\|[^|\n]*\|[^|\n]*\|/g

  if (tablePattern.test(content)) {
    // Replace table-like structures with conversational text
    return content.replace(tablePattern, match => {
      // Extract content between pipes and convert to natural language
      const cells = match
        .split('|')
        .filter(cell => cell.trim())
        .map(cell => cell.trim())
      if (cells.length >= 2) {
        return `${cells[0]} includes ${cells.slice(1).join(', ')}.`
      }
      return match.replace(/\|/g, ' ')
    })
  }

  // Handle other structured content patterns
  content = content
    .replace(/\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g, '$1: $2') // Simple key-value pairs
    .replace(/[-]{3,}/g, '') // Remove separator lines

  return content
}
