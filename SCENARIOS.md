# 🎯 Real-World Scenarios

This guide shows you exactly which boilerplates to use for different types of projects.

---

## Table of Contents

1. [Educational Platforms](#educational-platforms)
2. [SaaS Applications](#saas-applications)
3. [E-commerce & Marketplaces](#e-commerce--marketplaces)
4. [Internal Tools](#internal-tools)
5. [Social Platforms](#social-platforms)
6. [Content Management](#content-management)

---

## Educational Platforms

### Scenario 1: Online Course Platform (Like Udemy)

**Goal**: Build a platform where instructors can create courses and students can enroll and learn.

**Boilerplates Needed**:
```bash
techshu add authentication          # User login/signup
techshu add course-management       # Course creation & management
techshu add assignment-system       # Homework & assignments
techshu add progress-tracking       # Track student progress
techshu add ai-chat-system         # AI tutor for students
techshu add email-service          # Email notifications
techshu add file-upload            # Upload course materials
techshu add pdf-generator          # Generate certificates
```

**Implementation Time**: 2-3 days  
**Time Saved**: 2-3 months

**Key Features You Get**:
- ✅ User authentication with roles (student, instructor, admin)
- ✅ Course creation with modules and chapters
- ✅ Video and content management
- ✅ Assignment submission and grading
- ✅ Progress tracking and certificates
- ✅ AI-powered tutoring
- ✅ Email notifications for enrollments, completions

**Database Schema**:
```sql
-- From authentication boilerplate
profiles (id, email, role, created_at)

-- From course-management boilerplate
courses (id, title, description, instructor_id)
modules (id, course_id, title, order)
chapters (id, module_id, title, content, video_url)

-- From progress-tracking boilerplate
progress (user_id, chapter_id, completed, completed_at)

-- From assignment-system boilerplate
assignments (id, chapter_id, title, description)
submissions (id, assignment_id, user_id, file_url, grade)
```

---

### Scenario 2: Corporate Training Platform

**Goal**: Internal training platform for employees with compliance tracking.

**Boilerplates Needed**:
```bash
techshu add authentication
techshu add course-management
techshu add progress-tracking
techshu add admin-dashboard
techshu add analytics-dashboard
techshu add email-service
techshu add pdf-generator
```

**Implementation Time**: 2 days  
**Time Saved**: 6-8 weeks

**Key Features**:
- ✅ SSO integration (extend authentication)
- ✅ Mandatory training courses
- ✅ Completion tracking and reporting
- ✅ Admin dashboard for HR
- ✅ Automated reminders
- ✅ Certificate generation

---

### Scenario 3: Tutoring Marketplace

**Goal**: Platform connecting tutors with students for 1-on-1 sessions.

**Boilerplates Needed**:
```bash
techshu add authentication
techshu add user-management
techshu add realtime-chat
techshu add voice-ai
techshu add email-service
techshu add analytics-dashboard
```

**Implementation Time**: 3 days  
**Time Saved**: 2 months

---

## SaaS Applications

### Scenario 4: Project Management Tool

**Goal**: Build a tool like Trello or Asana.

**Boilerplates Needed**:
```bash
techshu add authentication
techshu add admin-dashboard
techshu add user-management
techshu add role-permission
techshu add notification-system
techshu add email-service
techshu add file-upload
techshu add settings-management
```

**Implementation Time**: 3-4 days  
**Time Saved**: 2-3 months

**Key Features**:
- ✅ User authentication and team management
- ✅ Role-based permissions (admin, member, viewer)
- ✅ Real-time notifications
- ✅ File attachments
- ✅ Email notifications
- ✅ User settings and preferences

**Example Code**:
```typescript
// app/projects/[id]/page.tsx
import { UserManagementTable } from '@/components/UserManagementTable'
import { RoleManagementTable } from '@/components/RoleManagementTable'
import { NotificationCenter } from '@/components/NotificationCenter'

export default async function ProjectPage({ params }) {
  const { data: project } = await supabase
    .from('projects')
    .select('*, members(*)')
    .eq('id', params.id)
    .single()
  
  return (
    <div>
      <h1>{project.name}</h1>
      <UserManagementTable users={project.members} />
      <NotificationCenter projectId={project.id} />
    </div>
  )
}
```

---

### Scenario 5: CRM System

**Goal**: Customer relationship management system.

**Boilerplates Needed**:
```bash
techshu add authentication
techshu add admin-dashboard
techshu add user-management
techshu add email-service
techshu add analytics-dashboard
techshu add file-manager
techshu add settings-management
```

**Implementation Time**: 3 days  
**Time Saved**: 2 months

---

### Scenario 6: Analytics Dashboard

**Goal**: Data visualization and reporting tool.

**Boilerplates Needed**:
```bash
techshu add authentication
techshu add analytics-dashboard
techshu add dashboard-components
techshu add pdf-generator
techshu add email-service
```

**Implementation Time**: 1-2 days  
**Time Saved**: 3-4 weeks

---

## E-commerce & Marketplaces

### Scenario 7: Online Store

**Goal**: E-commerce platform with products, cart, and checkout.

**Boilerplates Needed**:
```bash
techshu add authentication
techshu add file-upload
techshu add email-service
techshu add admin-dashboard
techshu add analytics-dashboard
techshu add pdf-generator
```

**Implementation Time**: 3-4 days  
**Time Saved**: 6-8 weeks

**Key Features**:
- ✅ User accounts
- ✅ Product management with images
- ✅ Order confirmation emails
- ✅ Admin panel for inventory
- ✅ Sales analytics
- ✅ Invoice generation

**Example Code**:
```typescript
// app/admin/products/new/page.tsx
import { FileUploadManager } from '@/components/FileUploadManager'

export default function NewProductPage() {
  const handleSubmit = async (formData: FormData) => {
    // Upload images
    const images = await uploadImages(formData.getAll('images'))
    
    // Create product
    const { data } = await supabase.from('products').insert({
      name: formData.get('name'),
      price: formData.get('price'),
      images: images
    })
    
    // Send notification to admin
    await sendEmail({
      to: 'admin@store.com',
      subject: 'New Product Added',
      html: `Product ${data.name} has been added`
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Product Name" />
      <input name="price" type="number" placeholder="Price" />
      <FileUploadManager bucket="products" />
      <button type="submit">Create Product</button>
    </form>
  )
}
```

---

### Scenario 8: Freelance Marketplace

**Goal**: Platform connecting freelancers with clients.

**Boilerplates Needed**:
```bash
techshu add authentication
techshu add user-management
techshu add realtime-chat
techshu add email-service
techshu add file-upload
techshu add admin-dashboard
```

**Implementation Time**: 4 days  
**Time Saved**: 2-3 months

---

## Internal Tools

### Scenario 9: Employee Portal

**Goal**: Internal portal for HR, documents, and announcements.

**Boilerplates Needed**:
```bash
techshu add authentication
techshu add admin-dashboard
techshu add user-management
techshu add file-manager
techshu add notification-system
techshu add email-service
techshu add settings-management
```

**Implementation Time**: 2 days  
**Time Saved**: 4-6 weeks

**Key Features**:
- ✅ Employee directory
- ✅ Document management
- ✅ Announcements
- ✅ Leave requests
- ✅ Email notifications

---

### Scenario 10: Database Admin Tool

**Goal**: Internal tool for managing database and monitoring.

**Boilerplates Needed**:
```bash
techshu add authentication
techshu add database-admin-tools
techshu add admin-dashboard
techshu add analytics-dashboard
```

**Implementation Time**: 1 day  
**Time Saved**: 2-3 weeks

---

## Social Platforms

### Scenario 11: Community Forum

**Goal**: Discussion forum with threads and comments.

**Boilerplates Needed**:
```bash
techshu add authentication
techshu add realtime-chat
techshu add notification-system
techshu add email-service
techshu add user-management
techshu add content-management
```

**Implementation Time**: 3 days  
**Time Saved**: 6-8 weeks

---

### Scenario 12: Social Learning Platform

**Goal**: Platform where users can share and learn from each other.

**Boilerplates Needed**:
```bash
techshu add authentication
techshu add course-management
techshu add realtime-chat
techshu add ai-chat-system
techshu add notification-system
techshu add email-service
techshu add bookmarks-system
techshu add notes-system
```

**Implementation Time**: 4-5 days  
**Time Saved**: 3 months

**Example Code**:
```typescript
// app/learn/[courseId]/page.tsx
import { AdvancedAITutor } from '@/components/AdvancedAITutor'
import { NotesPanel } from '@/components/NotesPanel'
import { BookmarkButton } from '@/components/BookmarkButton'

export default function LearnPage({ params }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Main content */}
      <div className="col-span-2">
        <CourseContent courseId={params.courseId} />
        <BookmarkButton chapterId={currentChapter.id} />
      </div>
      
      {/* Sidebar */}
      <div>
        <NotesPanel chapterId={currentChapter.id} />
        <AdvancedAITutor courseId={params.courseId} />
      </div>
    </div>
  )
}
```

---

## Content Management

### Scenario 13: Blog Platform

**Goal**: Multi-author blog with rich content.

**Boilerplates Needed**:
```bash
techshu add authentication
techshu add rich-text-editor
techshu add content-management
techshu add file-upload
techshu add seo-components
techshu add email-service
```

**Implementation Time**: 2 days  
**Time Saved**: 3-4 weeks

---

### Scenario 14: Documentation Site

**Goal**: Technical documentation with search and versioning.

**Boilerplates Needed**:
```bash
techshu add authentication
techshu add content-management
techshu add rich-text-editor
techshu add navigation-system
techshu add seo-components
```

**Implementation Time**: 1-2 days  
**Time Saved**: 2-3 weeks

---

## Quick Reference

### By Project Type

| Project Type | Boilerplates | Time | Saved |
|-------------|-------------|------|-------|
| **LMS** | 8 boilerplates | 2-3 days | 2-3 months |
| **SaaS** | 7 boilerplates | 3-4 days | 2-3 months |
| **E-commerce** | 6 boilerplates | 3-4 days | 6-8 weeks |
| **Internal Tool** | 5 boilerplates | 2 days | 4-6 weeks |
| **Social Platform** | 8 boilerplates | 4-5 days | 3 months |
| **Blog/CMS** | 5 boilerplates | 2 days | 3-4 weeks |

### By Feature

| Feature | Boilerplate | Time |
|---------|------------|------|
| User Auth | authentication | 15 min |
| Admin Panel | admin-dashboard | 30 min |
| Email | email-service | 15 min |
| File Upload | file-upload | 20 min |
| AI Chat | ai-chat-system | 20 min |
| Analytics | analytics-dashboard | 30 min |

---

## Need Help?

Can't find your scenario? Ask in our discussions:
https://github.com/teachskillofskills-ai/techshu-boilerplates/discussions

---

## Author

**Created with ❤️ by [Indranil Banerjee](https://in.linkedin.com/in/askneelnow)**
*Head of AI Transformation, INT TechShu*

© 2025 TechShu - Created by Indranil Banerjee

