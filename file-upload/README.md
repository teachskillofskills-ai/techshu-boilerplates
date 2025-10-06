# 📁 File Upload System Boilerplate

A complete file upload system with drag & drop, progress tracking, validation, and Supabase storage integration.

## ✨ Features

- ✅ Drag & drop file upload
- ✅ Multiple file support
- ✅ Upload progress tracking
- ✅ File type validation
- ✅ File size validation
- ✅ Image optimization
- ✅ Preview before upload
- ✅ Supabase storage integration
- ✅ CDN delivery
- ✅ Secure file access
- ✅ File management (delete, rename)
- ✅ Thumbnail generation

## 📦 Installation

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js react-dropzone
```

### 2. Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Database & Storage Setup

```bash
# Run storage bucket setup
psql -f database/storage_setup.sql

# Or use Supabase Dashboard:
# 1. Go to Storage
# 2. Create a new bucket
# 3. Set up RLS policies
```

## 🗄️ Storage Configuration

### Buckets Created

1. **uploads** - General file uploads
2. **avatars** - User profile pictures
3. **documents** - Document files
4. **images** - Image files
5. **videos** - Video files

### Storage Policies

- Users can upload to their own folder
- Users can read their own files
- Public files are readable by anyone
- Admins can access all files

## 📁 File Structure

```
file-upload/
├── README.md
├── components/
│   ├── FileUpload.tsx          # Main upload component
│   ├── FileDropzone.tsx        # Drag & drop zone
│   ├── FilePreview.tsx         # File preview
│   ├── UploadProgress.tsx      # Progress indicator
│   ├── FileList.tsx            # List uploaded files
│   └── ImageOptimizer.tsx      # Image optimization
├── lib/
│   ├── upload-service.ts       # Upload logic
│   ├── storage-utils.ts        # Storage utilities
│   ├── file-validation.ts      # Validation rules
│   └── image-processing.ts     # Image processing
├── hooks/
│   ├── useFileUpload.ts        # Upload hook
│   └── useFileList.ts          # File list hook
├── database/
│   ├── storage_setup.sql       # Storage bucket setup
│   └── file_metadata_table.sql # File metadata table
├── types/
│   └── file-types.ts           # TypeScript types
└── examples/
    ├── basic-upload.tsx
    ├── image-upload.tsx
    ├── multiple-files.tsx
    └── with-preview.tsx
```

## 🚀 Quick Start

### Basic File Upload

```tsx
import { FileUpload } from '@/boilerplates/file-upload/components/FileUpload'

export default function UploadPage() {
  const handleUpload = (url: string) => {
    console.log('File uploaded:', url)
    // Save URL to database, etc.
  }

  return (
    <FileUpload
      bucket="uploads"
      onUpload={handleUpload}
      accept="image/*"
      maxSize={5 * 1024 * 1024} // 5MB
    />
  )
}
```

### Image Upload with Preview

```tsx
import { FileUpload } from '@/boilerplates/file-upload/components/FileUpload'

export default function ImageUpload() {
  return (
    <FileUpload
      bucket="images"
      accept="image/png,image/jpeg,image/webp"
      maxSize={10 * 1024 * 1024}
      showPreview={true}
      optimize={true}
      onUpload={(url) => console.log('Image:', url)}
    />
  )
}
```

### Multiple Files Upload

```tsx
import { FileUpload } from '@/boilerplates/file-upload/components/FileUpload'

export default function MultipleUpload() {
  const handleMultipleUpload = (urls: string[]) => {
    console.log('Files uploaded:', urls)
  }

  return (
    <FileUpload
      bucket="documents"
      multiple={true}
      maxFiles={5}
      onMultipleUpload={handleMultipleUpload}
    />
  )
}
```

### Using the Upload Hook

```tsx
'use client'

import { useFileUpload } from '@/boilerplates/file-upload/hooks/useFileUpload'

export default function CustomUpload() {
  const { upload, uploading, progress, error } = useFileUpload({
    bucket: 'uploads',
    maxSize: 5 * 1024 * 1024,
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = await upload(file)
    console.log('Uploaded:', url)
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} disabled={uploading} />
      {uploading && <div>Progress: {progress}%</div>}
      {error && <div>Error: {error}</div>}
    </div>
  )
}
```

## 🎨 Component Props

### FileUpload Component

```typescript
interface FileUploadProps {
  // Required
  bucket: string                    // Storage bucket name
  onUpload: (url: string) => void   // Callback when upload completes

  // Optional
  accept?: string                   // Accepted file types
  maxSize?: number                  // Max file size in bytes
  multiple?: boolean                // Allow multiple files
  maxFiles?: number                 // Max number of files
  showPreview?: boolean             // Show file preview
  optimize?: boolean                // Optimize images
  folder?: string                   // Upload to specific folder
  publicAccess?: boolean            // Make files publicly accessible
  onError?: (error: string) => void // Error callback
  onProgress?: (progress: number) => void // Progress callback
  className?: string                // Custom CSS classes
}
```

## 🔒 Security Features

### File Validation

```typescript
// Validate file type
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
if (!allowedTypes.includes(file.type)) {
  throw new Error('Invalid file type')
}

// Validate file size
const maxSize = 5 * 1024 * 1024 // 5MB
if (file.size > maxSize) {
  throw new Error('File too large')
}

// Validate file name
const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
```

### Storage Security

```sql
-- RLS Policy: Users can only upload to their own folder
CREATE POLICY "Users can upload to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS Policy: Users can read their own files
CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

## 🖼️ Image Optimization

### Automatic Optimization

```tsx
<FileUpload
  bucket="images"
  optimize={true}
  optimizeOptions={{
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    format: 'webp'
  }}
/>
```

### Manual Optimization

```typescript
import { optimizeImage } from '@/boilerplates/file-upload/lib/image-processing'

const optimized = await optimizeImage(file, {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
  format: 'webp'
})
```

## 📊 File Metadata

### Store File Information

```typescript
// Save file metadata to database
const { data, error } = await supabase
  .from('file_metadata')
  .insert({
    user_id: userId,
    file_name: file.name,
    file_size: file.size,
    file_type: file.type,
    storage_path: path,
    public_url: url,
  })
```

### Retrieve File List

```typescript
import { useFileList } from '@/boilerplates/file-upload/hooks/useFileList'

function FileManager() {
  const { files, loading, refresh, deleteFile } = useFileList({
    bucket: 'uploads',
    folder: userId,
  })

  return (
    <div>
      {files.map(file => (
        <div key={file.id}>
          <span>{file.name}</span>
          <button onClick={() => deleteFile(file.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}
```

## 🎯 Advanced Features

### Chunked Upload (Large Files)

```typescript
import { uploadLargeFile } from '@/boilerplates/file-upload/lib/upload-service'

const url = await uploadLargeFile(file, {
  bucket: 'videos',
  chunkSize: 5 * 1024 * 1024, // 5MB chunks
  onProgress: (progress) => console.log(`${progress}%`),
})
```

### Resumable Upload

```typescript
import { ResumableUpload } from '@/boilerplates/file-upload/lib/upload-service'

const uploader = new ResumableUpload(file, {
  bucket: 'uploads',
  onProgress: (progress) => console.log(progress),
})

// Start upload
await uploader.start()

// Pause upload
uploader.pause()

// Resume upload
await uploader.resume()

// Cancel upload
uploader.cancel()
```

### Generate Thumbnails

```typescript
import { generateThumbnail } from '@/boilerplates/file-upload/lib/image-processing'

const thumbnail = await generateThumbnail(file, {
  width: 200,
  height: 200,
  fit: 'cover',
})

// Upload thumbnail
const thumbnailUrl = await upload(thumbnail, {
  bucket: 'thumbnails',
  folder: `${userId}/thumbnails`,
})
```

## 🧪 Testing

### Test File Upload

```typescript
import { uploadFile } from '@/boilerplates/file-upload/lib/upload-service'

// Create test file
const file = new File(['test content'], 'test.txt', { type: 'text/plain' })

// Upload
const url = await uploadFile(file, {
  bucket: 'uploads',
  folder: 'test',
})

expect(url).toContain('supabase.co')
```

### Test File Validation

```typescript
import { validateFile } from '@/boilerplates/file-upload/lib/file-validation'

const file = new File([''], 'test.exe', { type: 'application/x-msdownload' })

expect(() => validateFile(file, {
  allowedTypes: ['image/*'],
  maxSize: 5 * 1024 * 1024,
})).toThrow('Invalid file type')
```

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Storage bucket not found"
- **Solution**: Create bucket in Supabase Dashboard or run storage_setup.sql

**Issue**: "RLS policy violation"
- **Solution**: Check storage policies are applied correctly

**Issue**: "File too large"
- **Solution**: Increase maxSize or compress file before upload

**Issue**: "CORS error"
- **Solution**: Configure CORS in Supabase Storage settings

## 📚 API Reference

### uploadFile()

```typescript
async function uploadFile(
  file: File,
  options: {
    bucket: string
    folder?: string
    publicAccess?: boolean
    onProgress?: (progress: number) => void
  }
): Promise<string>
```

### deleteFile()

```typescript
async function deleteFile(
  path: string,
  bucket: string
): Promise<void>
```

### getFileUrl()

```typescript
function getFileUrl(
  path: string,
  bucket: string,
  options?: {
    download?: boolean
    transform?: {
      width?: number
      height?: number
      quality?: number
    }
  }
): string
```

## 🎓 Examples

Check the `examples/` folder for:
- Basic file upload
- Image upload with preview
- Multiple files upload
- Drag & drop upload
- Progress tracking
- File management
- Thumbnail generation

## 📈 Performance Tips

1. **Optimize images** before upload
2. **Use thumbnails** for previews
3. **Implement lazy loading** for file lists
4. **Use CDN** for file delivery
5. **Compress files** when possible
6. **Limit concurrent uploads** to 3-5 files

---

**Need help?** Check the examples folder for complete implementations.

