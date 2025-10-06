import { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'course' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  image = '/og-image.jpg',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
}: SEOProps): Metadata {
  const baseUrl = 'https://techshu.com'
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl
  const fullTitle = title
    ? `${title} | TechShu SkillHub`
    : 'TechShu SkillHub - Advanced Learning Management System'
  const defaultDescription =
    "Master digital marketing with our comprehensive LMS. Join 10,000+ professionals who've accelerated their careers with AI-powered learning, expert instructors, and hands-on projects."

  const metadata: Metadata = {
    title: fullTitle,
    description: description || defaultDescription,
    keywords: [
      'digital marketing',
      'online learning',
      'LMS',
      'AI-powered education',
      'professional development',
      ...keywords,
    ],
    authors: author ? [{ name: author }] : [{ name: 'TechShu SkillHub' }],
    creator: 'TechShu SkillHub',
    publisher: 'TechShu SkillHub',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url || '/',
    },
    openGraph: {
      type: type === 'course' ? 'article' : type,
      locale: 'en_US',
      url: fullUrl,
      title: fullTitle,
      description: description || defaultDescription,
      siteName: 'TechShu SkillHub',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || 'TechShu SkillHub - Digital Marketing Learning Platform',
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
      ...(section && { section }),
      ...(tags.length > 0 && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description || defaultDescription,
      images: [image],
      creator: '@techshu',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }

  return metadata
}

// Predefined SEO configurations for common pages
export const SEOConfigs = {
  homepage: {
    title: 'Master Digital Marketing Skills',
    description:
      'Join 10,000+ professionals mastering digital marketing with our AI-powered LMS. Expert instructors, hands-on projects, industry recognition.',
    keywords: ['digital marketing courses', 'online marketing training', 'marketing certification'],
  },

  courses: {
    title: 'Digital Marketing Courses',
    description:
      'Explore our comprehensive digital marketing courses. From beginner to advanced levels, master SEO, social media, PPC, content marketing and more.',
    keywords: [
      'digital marketing courses',
      'SEO training',
      'social media marketing',
      'PPC advertising',
    ],
  },

  about: {
    title: 'About TechShu SkillHub',
    description:
      "Learn about TechShu SkillHub's mission to democratize digital marketing education through AI-powered learning and expert instruction.",
    keywords: ['about techshu', 'digital marketing education', 'online learning platform'],
  },

  contact: {
    title: 'Contact Us',
    description:
      "Get in touch with TechShu SkillHub. We're here to help you succeed in your digital marketing journey.",
    keywords: ['contact techshu', 'customer support', 'help'],
  },

  signin: {
    title: 'Sign In',
    description:
      'Sign in to your TechShu SkillHub account to continue your digital marketing learning journey.',
    keywords: ['sign in', 'login', 'account access'],
  },

  signup: {
    title: 'Sign Up',
    description:
      'Join TechShu SkillHub today and start your digital marketing career transformation with our AI-powered learning platform.',
    keywords: ['sign up', 'register', 'join techshu', 'create account'],
  },

  dashboard: {
    title: 'Learning Dashboard',
    description:
      'Access your personalized learning dashboard. Track progress, view courses, and continue your digital marketing education.',
    keywords: ['dashboard', 'learning progress', 'my courses'],
  },
}

// Course-specific SEO generator
export function generateCourseSEO(course: {
  title: string
  description: string
  slug: string
  thumbnail_url?: string
  difficulty_level?: string
  estimated_duration?: number
  created_at?: string
  updated_at?: string
}) {
  const keywords = [
    course.title.toLowerCase(),
    'digital marketing course',
    course.difficulty_level || 'marketing training',
    'online course',
    'certification',
  ]

  const duration = course.estimated_duration
    ? `${Math.floor(course.estimated_duration / 60)}h ${course.estimated_duration % 60}m`
    : 'Self-paced'

  const enhancedDescription = `${course.description} | ${duration} course | ${course.difficulty_level || 'All'} level | Expert instruction | Hands-on projects | Industry certification.`

  return generateSEOMetadata({
    title: course.title,
    description: enhancedDescription,
    keywords,
    image: course.thumbnail_url || '/course-default-og.jpg',
    url: `/courses/${course.slug}`,
    type: 'course',
    publishedTime: course.created_at,
    modifiedTime: course.updated_at,
    section: 'Digital Marketing Courses',
    tags: keywords,
  })
}

// Chapter-specific SEO generator
export function generateChapterSEO(chapter: {
  title: string
  description?: string
  course_title: string
  course_slug: string
  chapter_number: number
}) {
  const title = `${chapter.title} - ${chapter.course_title}`
  const description =
    chapter.description ||
    `Chapter ${chapter.chapter_number} of ${chapter.course_title}. Continue your digital marketing learning journey with expert instruction and hands-on practice.`

  const keywords = [
    chapter.title.toLowerCase(),
    chapter.course_title.toLowerCase(),
    'digital marketing lesson',
    'online learning',
    `chapter ${chapter.chapter_number}`,
  ]

  return generateSEOMetadata({
    title,
    description,
    keywords,
    url: `/courses/${chapter.course_slug}/chapters/${chapter.chapter_number}`,
    type: 'article',
    section: chapter.course_title,
    tags: keywords,
  })
}

// Structured data generators
export function generateCourseStructuredData(course: {
  title: string
  description: string
  slug: string
  thumbnail_url?: string
  difficulty_level?: string
  estimated_duration?: number
  price?: number
  instructor?: string
  rating?: number
  review_count?: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    url: `https://techshu.com/courses/${course.slug}`,
    image: course.thumbnail_url || 'https://techshu.com/course-default.jpg',
    provider: {
      '@type': 'Organization',
      name: 'TechShu SkillHub',
      url: 'https://techshu.com',
    },
    ...(course.instructor && {
      instructor: {
        '@type': 'Person',
        name: course.instructor,
      },
    }),
    ...(course.estimated_duration && {
      timeRequired: `PT${course.estimated_duration}M`,
    }),
    ...(course.difficulty_level && {
      educationalLevel: course.difficulty_level,
    }),
    ...(course.price && {
      offers: {
        '@type': 'Offer',
        price: course.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    }),
    ...(course.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: course.rating,
        reviewCount: course.review_count || 1,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    courseMode: 'online',
    educationalCredentialAwarded: 'Certificate of Completion',
    inLanguage: 'en-US',
    isAccessibleForFree: course.price === 0,
  }
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'TechShu SkillHub',
    description: 'Advanced Learning Management System for digital marketing education',
    url: 'https://techshu.com',
    logo: 'https://techshu.com/logo.png',
    sameAs: [
      'https://www.facebook.com/techshu',
      'https://twitter.com/techshu',
      'https://www.linkedin.com/company/techshu',
      'https://www.youtube.com/techshu',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-408-520-7777',
      contactType: 'customer service',
      email: 'support@techshu.com',
      availableLanguage: 'English',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
      addressRegion: 'CA',
    },
    foundingDate: '2024',
    numberOfEmployees: '50-100',
    knowsAbout: [
      'Digital Marketing',
      'SEO',
      'Social Media Marketing',
      'Content Marketing',
      'PPC Advertising',
      'Email Marketing',
      'Analytics',
    ],
  }
}
