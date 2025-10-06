# 📁 File Manager Boilerplate

Complete file management system with upload, download, organize, and share capabilities.

## ✨ Features

- ✅ **File Upload** - Upload files
- ✅ **File Browser** - Browse files
- ✅ **Folders** - Organize in folders
- ✅ **Search** - Find files quickly
- ✅ **Preview** - Preview files
- ✅ **Download** - Download files
- ✅ **Share** - Share files
- ✅ **Permissions** - Access control
- ✅ **Drag & Drop** - Easy upload
- ✅ **Bulk Operations** - Multiple files

## 📦 Installation

```bash
npm install lucide-react
cp -r boilerplates/file-manager/components ./src/components/files
```

## 🚀 Quick Start

```typescript
import { FileManager } from '@/components/files/FileManager'

function FilesPage() {
  return (
    <FileManager
      userId={userId}
      onUpload={handleUpload}
      onDownload={handleDownload}
    />
  )
}
```

## 💡 Use Cases

### Course Materials

```typescript
<FileManager
  folder="course-materials"
  allowedTypes={['pdf', 'doc', 'ppt']}
  maxSize={10 * 1024 * 1024} // 10MB
/>
```

---

**Need help?** Check the examples folder for complete implementations.

