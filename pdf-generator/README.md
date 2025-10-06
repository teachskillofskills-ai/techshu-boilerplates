# 📄 PDF Generator Boilerplate

A powerful PDF generation system for creating beautiful, branded PDFs from content. Perfect for generating course materials, reports, certificates, and downloadable content.

## ✨ Features

- ✅ **Beautiful PDFs** - Professional formatting with branding
- ✅ **Markdown Support** - Convert markdown to formatted PDF
- ✅ **Auto Pagination** - Automatic page breaks
- ✅ **Headers & Footers** - Branded headers and page numbers
- ✅ **Custom Styling** - Fonts, colors, spacing
- ✅ **Multi-page Support** - Handles long content
- ✅ **Download Function** - One-click download
- ✅ **TypeScript** - Full type safety
- ✅ **Lightweight** - Uses jsPDF library

## 📦 Installation

### 1. Install Dependencies

```bash
npm install jspdf
```

### 2. Copy Files

```bash
cp -r boilerplates/pdf-generator/lib ./src/lib/pdf
```

### 3. Import and Use

```typescript
import { PDFGenerator, downloadChapterPDF } from '@/lib/pdf/generator'
```

## 🚀 Quick Start

### Basic PDF Generation

```typescript
import { downloadChapterPDF } from '@/lib/pdf/generator'

// Generate and download PDF
downloadChapterPDF({
  title: 'Introduction to React',
  content: 'Your content here...',
  courseTitle: 'React Fundamentals',
  chapterNumber: 1
})
```

### Advanced Usage

```typescript
import { PDFGenerator } from '@/lib/pdf/generator'

const generator = new PDFGenerator()

const pdfBytes = generator.generateChapterPDF({
  title: 'Advanced TypeScript',
  content: `
# Introduction
This chapter covers advanced TypeScript concepts.

## Generics
Generics provide type safety...

- Type parameters
- Constraints
- Utility types
  `,
  courseTitle: 'TypeScript Mastery',
  chapterNumber: 5
})

// Convert to blob and download
const blob = new Blob([pdfBytes], { type: 'application/pdf' })
const url = URL.createObjectURL(blob)
window.open(url)
```

## 📝 Markdown Support

### Supported Markdown

```markdown
# Header 1
## Header 2
### Header 3

Regular paragraph text.

- Bullet point 1
- Bullet point 2

1. Numbered item 1
2. Numbered item 2
```

### Example

```typescript
const content = `
# Course Overview
Welcome to this comprehensive course.

## What You'll Learn
- React fundamentals
- State management
- Component patterns

## Prerequisites
1. JavaScript basics
2. HTML/CSS knowledge
3. Node.js installed
`

downloadChapterPDF({
  title: 'Course Introduction',
  content,
  courseTitle: 'React Bootcamp'
})
```

## 🎨 Customization

### Custom Branding

```typescript
// Modify in generator.ts
private addHeader(chapterData: ChapterData) {
  // Change colors
  this.doc.setTextColor(100, 100, 100) // Gray
  
  // Change fonts
  this.doc.setFont('helvetica', 'bold')
  
  // Add logo (if you have one)
  // this.doc.addImage(logoData, 'PNG', x, y, width, height)
}
```

### Custom Footer

```typescript
private addFooter() {
  // Customize footer text
  const brandText = 'Your Company Name'
  
  // Customize footer color
  this.doc.setDrawColor(225, 29, 72) // Your brand color
}
```

### Custom Styling

```typescript
// Modify line height
this.lineHeight = 7 // Default

// Modify margins
this.margin = 20 // Default

// Modify font sizes
this.doc.setFontSize(24) // Title
this.doc.setFontSize(11) // Body
```

## 📊 API Reference

### PDFGenerator Class

#### constructor()

Create a new PDF generator instance.

```typescript
const generator = new PDFGenerator()
```

#### generateChapterPDF(chapterData)

Generate PDF from chapter data.

```typescript
interface ChapterData {
  title: string
  content: string
  courseTitle: string
  chapterNumber?: number
}

const pdfBytes = generator.generateChapterPDF(chapterData)
```

### downloadChapterPDF(chapterData)

Generate and download PDF in one step.

```typescript
downloadChapterPDF({
  title: 'Chapter Title',
  content: 'Chapter content...',
  courseTitle: 'Course Name',
  chapterNumber: 1
})
```

## 💡 Use Cases

### 1. Course Materials

```typescript
// Generate course chapter PDF
downloadChapterPDF({
  title: 'Introduction to JavaScript',
  content: courseContent,
  courseTitle: 'JavaScript Fundamentals',
  chapterNumber: 1
})
```

### 2. Reports

```typescript
// Generate report PDF
const generator = new PDFGenerator()
const pdfBytes = generator.generateChapterPDF({
  title: 'Monthly Report',
  content: reportContent,
  courseTitle: 'Analytics Dashboard'
})
```

### 3. Certificates

```typescript
// Generate certificate
const certificateContent = `
# Certificate of Completion

This certifies that **${userName}** has successfully completed:

**${courseName}**

Date: ${completionDate}
`

downloadChapterPDF({
  title: 'Certificate',
  content: certificateContent,
  courseTitle: 'Course Completion'
})
```

### 4. Study Guides

```typescript
// Generate study guide
const studyGuide = `
# Study Guide

## Key Concepts
- Concept 1
- Concept 2

## Practice Questions
1. Question 1
2. Question 2
`

downloadChapterPDF({
  title: 'Study Guide',
  content: studyGuide,
  courseTitle: 'Exam Preparation'
})
```

## 🔧 Advanced Features

### Multiple Chapters

```typescript
const chapters = [
  { title: 'Chapter 1', content: '...', chapterNumber: 1 },
  { title: 'Chapter 2', content: '...', chapterNumber: 2 },
  { title: 'Chapter 3', content: '...', chapterNumber: 3 }
]

chapters.forEach(chapter => {
  downloadChapterPDF({
    ...chapter,
    courseTitle: 'Complete Course'
  })
})
```

### Custom Filename

```typescript
// Modify download function
const link = document.createElement('a')
link.download = `custom-filename-${Date.now()}.pdf`
```

### Email PDF

```typescript
import { PDFGenerator } from '@/lib/pdf/generator'

const generator = new PDFGenerator()
const pdfBytes = generator.generateChapterPDF(chapterData)

// Convert to base64 for email
const base64 = btoa(String.fromCharCode(...new Uint8Array(pdfBytes)))

// Send via email API
await sendEmail({
  to: 'user@example.com',
  subject: 'Your Course Material',
  attachments: [{
    filename: 'chapter.pdf',
    content: base64,
    encoding: 'base64'
  }]
})
```

### Save to Server

```typescript
const pdfBytes = generator.generateChapterPDF(chapterData)
const blob = new Blob([pdfBytes], { type: 'application/pdf' })

// Upload to server
const formData = new FormData()
formData.append('pdf', blob, 'chapter.pdf')

await fetch('/api/upload-pdf', {
  method: 'POST',
  body: formData
})
```

## 🎨 Styling Guide

### Colors

```typescript
// Text colors
this.doc.setTextColor(0, 0, 0)        // Black
this.doc.setTextColor(100, 100, 100)  // Gray
this.doc.setTextColor(225, 29, 72)    // Brand color

// Line colors
this.doc.setDrawColor(200, 200, 200)  // Light gray
this.doc.setDrawColor(225, 29, 72)    // Brand color
```

### Fonts

```typescript
// Available fonts
this.doc.setFont('helvetica', 'normal')
this.doc.setFont('helvetica', 'bold')
this.doc.setFont('helvetica', 'italic')
this.doc.setFont('times', 'normal')
this.doc.setFont('courier', 'normal')
```

### Font Sizes

```typescript
this.doc.setFontSize(24)  // Title
this.doc.setFontSize(16)  // Header 1
this.doc.setFontSize(14)  // Header 2
this.doc.setFontSize(12)  // Header 3
this.doc.setFontSize(11)  // Body text
this.doc.setFontSize(10)  // Small text
this.doc.setFontSize(8)   // Footer
```

## 🐛 Troubleshooting

**Issue**: PDF not downloading
- **Solution**: Check browser popup blocker, ensure blob is created correctly

**Issue**: Content cut off
- **Solution**: Increase page height or reduce content per page

**Issue**: Formatting issues
- **Solution**: Check markdown syntax, ensure proper line breaks

**Issue**: Large file size
- **Solution**: Reduce image quality, compress content

## 📈 Performance Tips

1. **Lazy generation** - Generate PDFs on demand
2. **Cache PDFs** - Store generated PDFs for reuse
3. **Compress content** - Remove unnecessary whitespace
4. **Optimize images** - Reduce image size before adding
5. **Batch generation** - Generate multiple PDFs in background

## 🧪 Testing

```typescript
describe('PDFGenerator', () => {
  test('generates PDF', () => {
    const generator = new PDFGenerator()
    const pdfBytes = generator.generateChapterPDF({
      title: 'Test',
      content: 'Test content',
      courseTitle: 'Test Course'
    })
    
    expect(pdfBytes).toBeInstanceOf(ArrayBuffer)
    expect(pdfBytes.byteLength).toBeGreaterThan(0)
  })
})
```

## 📚 Examples

Check the `examples/` folder for:
- Basic PDF generation
- Markdown formatting
- Custom styling
- Multiple chapters
- Email integration

## 🔄 Migration Guide

### From html2pdf

```typescript
// Before
html2pdf().from(element).save()

// After
downloadChapterPDF({
  title: 'Document',
  content: element.textContent,
  courseTitle: 'Documents'
})
```

### From pdfmake

```typescript
// Before
pdfMake.createPdf(docDefinition).download()

// After
downloadChapterPDF({
  title: 'Document',
  content: markdownContent,
  courseTitle: 'Documents'
})
```

## 📖 Resources

- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [PDF Best Practices](https://www.adobe.com/acrobat/hub/pdf-best-practices.html)
- [Markdown Guide](https://www.markdownguide.org/)

---

**Need help?** Check the examples folder for complete implementations.

