// PDF Generation Utility for Chapter Downloads
import { jsPDF } from 'jspdf'

interface ChapterData {
  title: string
  content: string
  courseTitle: string
  chapterNumber?: number
}

export class PDFGenerator {
  private doc: jsPDF
  private pageWidth: number
  private pageHeight: number
  private margin: number
  private currentY: number
  private lineHeight: number

  constructor() {
    this.doc = new jsPDF()
    this.pageWidth = this.doc.internal.pageSize.getWidth()
    this.pageHeight = this.doc.internal.pageSize.getHeight()
    this.margin = 20
    this.currentY = this.margin
    this.lineHeight = 7
  }

  generateChapterPDF(chapterData: ChapterData): ArrayBuffer {
    this.addHeader(chapterData)
    this.addTitle(chapterData.title)
    this.addContent(chapterData.content)
    this.addFooter()

    return this.doc.output('arraybuffer') as ArrayBuffer
  }

  private addHeader(chapterData: ChapterData) {
    // Add course title header
    this.doc.setFontSize(10)
    this.doc.setTextColor(100, 100, 100)
    this.doc.text(chapterData.courseTitle, this.margin, 15)

    // Add date
    const date = new Date().toLocaleDateString()
    const dateWidth = this.doc.getTextWidth(date)
    this.doc.text(date, this.pageWidth - this.margin - dateWidth, 15)

    // Add separator line
    this.doc.setDrawColor(200, 200, 200)
    this.doc.line(this.margin, 18, this.pageWidth - this.margin, 18)

    this.currentY = 30
  }

  private addTitle(title: string) {
    this.doc.setFontSize(24)
    this.doc.setTextColor(0, 0, 0)
    this.doc.setFont('helvetica', 'bold')

    // Split title if too long
    const titleLines = this.doc.splitTextToSize(title, this.pageWidth - 2 * this.margin)

    titleLines.forEach((line: string) => {
      this.doc.text(line, this.margin, this.currentY)
      this.currentY += 12
    })

    this.currentY += 10

    // Add title underline
    this.doc.setDrawColor(225, 29, 72) // TechShu red color
    this.doc.setLineWidth(2)
    this.doc.line(this.margin, this.currentY - 5, this.pageWidth - this.margin, this.currentY - 5)

    this.currentY += 15
  }

  private addContent(content: string) {
    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(11)
    this.doc.setTextColor(40, 40, 40)

    // Convert markdown-like content to formatted text
    const processedContent = this.processMarkdown(content)

    processedContent.forEach(block => {
      this.addContentBlock(block)
    })
  }

  private processMarkdown(content: string): Array<{ type: string; text: string; level?: number }> {
    const lines = content.split('\n')
    const blocks: Array<{ type: string; text: string; level?: number }> = []

    lines.forEach(line => {
      const trimmed = line.trim()

      if (!trimmed) {
        blocks.push({ type: 'space', text: '' })
        return
      }

      // Headers
      if (trimmed.startsWith('# ')) {
        blocks.push({ type: 'header', text: trimmed.substring(2), level: 1 })
      } else if (trimmed.startsWith('## ')) {
        blocks.push({ type: 'header', text: trimmed.substring(3), level: 2 })
      } else if (trimmed.startsWith('### ')) {
        blocks.push({ type: 'header', text: trimmed.substring(4), level: 3 })
      }
      // Lists
      else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        blocks.push({ type: 'list', text: trimmed.substring(2) })
      }
      // Numbered lists
      else if (/^\d+\.\s/.test(trimmed)) {
        blocks.push({ type: 'numbered', text: trimmed.replace(/^\d+\.\s/, '') })
      }
      // Regular paragraph
      else {
        blocks.push({ type: 'paragraph', text: trimmed })
      }
    })

    return blocks
  }

  private addContentBlock(block: { type: string; text: string; level?: number }) {
    switch (block.type) {
      case 'header':
        this.addHeader2(block.text, block.level || 1)
        break
      case 'list':
        this.addListItem(block.text)
        break
      case 'numbered':
        this.addNumberedItem(block.text)
        break
      case 'paragraph':
        this.addParagraph(block.text)
        break
      case 'space':
        this.currentY += this.lineHeight
        break
    }
  }

  private addHeader2(text: string, level: number) {
    this.checkPageBreak(20)

    const fontSize = level === 1 ? 16 : level === 2 ? 14 : 12
    this.doc.setFontSize(fontSize)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(0, 0, 0)

    const lines = this.doc.splitTextToSize(text, this.pageWidth - 2 * this.margin)
    lines.forEach((line: string) => {
      this.doc.text(line, this.margin, this.currentY)
      this.currentY += fontSize * 0.6
    })

    this.currentY += 8
  }

  private addParagraph(text: string) {
    this.checkPageBreak(15)

    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(40, 40, 40)

    const lines = this.doc.splitTextToSize(text, this.pageWidth - 2 * this.margin)
    lines.forEach((line: string) => {
      this.checkPageBreak(this.lineHeight)
      this.doc.text(line, this.margin, this.currentY)
      this.currentY += this.lineHeight
    })

    this.currentY += 5
  }

  private addListItem(text: string) {
    this.checkPageBreak(10)

    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(40, 40, 40)

    // Add bullet point
    this.doc.text('•', this.margin + 5, this.currentY)

    const lines = this.doc.splitTextToSize(text, this.pageWidth - 2 * this.margin - 15)
    lines.forEach((line: string, index: number) => {
      this.checkPageBreak(this.lineHeight)
      this.doc.text(line, this.margin + 15, this.currentY)
      this.currentY += this.lineHeight
    })

    this.currentY += 2
  }

  private addNumberedItem(text: string) {
    this.checkPageBreak(10)

    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(40, 40, 40)

    const lines = this.doc.splitTextToSize(text, this.pageWidth - 2 * this.margin - 15)
    lines.forEach((line: string) => {
      this.checkPageBreak(this.lineHeight)
      this.doc.text(line, this.margin + 15, this.currentY)
      this.currentY += this.lineHeight
    })

    this.currentY += 2
  }

  private checkPageBreak(requiredSpace: number) {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin - 20) {
      this.doc.addPage()
      this.currentY = this.margin
    }
  }

  private addFooter() {
    const pageCount = this.doc.getNumberOfPages()

    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i)
      this.doc.setFontSize(8)
      this.doc.setTextColor(100, 100, 100)

      // TechShu SkillHub branding
      const brandText = 'TechShu SkillHub'
      this.doc.text(brandText, this.margin, this.pageHeight - 10)

      // Page number
      const pageText = `Page ${i} of ${pageCount}`
      const pageTextWidth = this.doc.getTextWidth(pageText)
      this.doc.text(pageText, this.pageWidth - this.margin - pageTextWidth, this.pageHeight - 10)

      // Footer line
      this.doc.setDrawColor(225, 29, 72) // TechShu red
      this.doc.line(
        this.margin,
        this.pageHeight - 15,
        this.pageWidth - this.margin,
        this.pageHeight - 15
      )
    }
  }
}

// Utility function to download PDF
export function downloadChapterPDF(chapterData: ChapterData) {
  const generator = new PDFGenerator()
  const pdfBytes = generator.generateChapterPDF(chapterData)

  // Create blob and download
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${chapterData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
