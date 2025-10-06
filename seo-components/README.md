# 🔍 SEO Components Boilerplate

Complete SEO component library for meta tags, structured data, and search optimization.

## ✨ Features

- ✅ **Meta Tags** - Title, description, keywords
- ✅ **Open Graph** - Social media previews
- ✅ **Twitter Cards** - Twitter previews
- ✅ **Structured Data** - JSON-LD schema
- ✅ **Canonical URLs** - Duplicate content
- ✅ **Robots Meta** - Crawler control
- ✅ **Sitemap** - XML sitemap
- ✅ **Breadcrumbs** - Navigation breadcrumbs
- ✅ **Alt Text** - Image descriptions
- ✅ **Schema Markup** - Rich snippets

## 📦 Installation

```bash
npm install next-seo
cp -r boilerplates/seo-components/components ./src/components/seo
```

## 🚀 Quick Start

```typescript
import { SEO } from '@/components/seo/SEO'

function CoursePage({ course }) {
  return (
    <>
      <SEO
        title={course.title}
        description={course.description}
        image={course.thumbnail}
        type="article"
      />
      <CourseContent course={course} />
    </>
  )
}
```

## 💡 Use Cases

### Course Page SEO

```typescript
<SEO
  title="React Fundamentals - TechShu LMS"
  description="Learn React from scratch with hands-on projects"
  image="/courses/react-thumbnail.jpg"
  type="article"
  structuredData={{
    "@type": "Course",
    "name": "React Fundamentals",
    "description": "...",
    "provider": {
      "@type": "Organization",
      "name": "TechShu LMS"
    }
  }}
/>
```

---

**Need help?** Check the examples folder for complete implementations.

