'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Upload,
  FileText,
  Image,
  FileSpreadsheet,
  Presentation,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Send,
} from 'lucide-react'

interface AssignmentFile {
  name: string
  type: string
  size: number
  url: string
}

interface Assignment {
  id: string
  title: string
  description: string
  status: 'pending' | 'submitted' | 'graded'
  submitted_at?: string
  grade?: number
  feedback?: string
  files: AssignmentFile[]
}

interface AssignmentUploadProps {
  userId: string
  courseId: string
  chapterId: string
  assignmentId?: string
}

const ALLOWED_FILE_TYPES = {
  'application/pdf': { icon: FileText, label: 'PDF' },
  'application/vnd.ms-powerpoint': { icon: Presentation, label: 'PPT' },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': {
    icon: Presentation,
    label: 'PPTX',
  },
  'application/vnd.ms-excel': { icon: FileSpreadsheet, label: 'Excel' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
    icon: FileSpreadsheet,
    label: 'Excel',
  },
  'image/jpeg': { icon: Image, label: 'JPEG' },
  'image/png': { icon: Image, label: 'PNG' },
  'text/plain': { icon: FileText, label: 'Text' },
  'text/markdown': { icon: FileText, label: 'Markdown' },
}

export function AssignmentUpload({
  userId,
  courseId,
  chapterId,
  assignmentId,
}: AssignmentUploadProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
  })
  const [uploadFiles, setUploadFiles] = useState<AssignmentFile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newFiles: AssignmentFile[] = []

    for (const file of Array.from(files)) {
      if (file.size > 25 * 1024 * 1024) {
        // 25MB limit for assignments
        alert(`File ${file.name} is too large. Maximum size is 25MB.`)
        continue
      }

      if (!Object.keys(ALLOWED_FILE_TYPES).includes(file.type)) {
        alert(`File type ${file.type} is not supported.`)
        continue
      }

      const url = URL.createObjectURL(file)

      newFiles.push({
        name: file.name,
        type: file.type,
        size: file.size,
        url,
      })
    }

    setUploadFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (index: number) => {
    setUploadFiles(prev => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].url)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const submitAssignment = async () => {
    if (!newAssignment.title.trim() && uploadFiles.length === 0) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          courseId,
          chapterId,
          title: newAssignment.title || 'Assignment Submission',
          description: newAssignment.description,
          files: uploadFiles.map(file => ({
            name: file.name,
            type: file.type,
            size: file.size,
          })),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setAssignments(prev => [...prev, data.assignment])
        setNewAssignment({ title: '', description: '' })
        setUploadFiles([])
        setIsCreating(false)
      } else {
        throw new Error('Failed to submit assignment')
      }
    } catch (error) {
      console.error('Error submitting assignment:', error)
      alert('Failed to submit assignment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFileIcon = (type: string) => {
    const fileType = ALLOWED_FILE_TYPES[type as keyof typeof ALLOWED_FILE_TYPES]
    return fileType ? fileType.icon : FileText
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return CheckCircle
      case 'graded':
        return CheckCircle
      default:
        return Clock
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'text-primary bg-primary/10 border-primary/20'
      case 'graded':
        return 'text-accent bg-accent/10 border-accent/20'
      default:
        return 'text-secondary bg-secondary/10 border-secondary/20'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-destructive flex items-center justify-center">
          <Upload className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h4 className="font-medium text-foreground">Assignment Submission</h4>
          <p className="text-xs text-muted-foreground">Upload your work for review</p>
        </div>
      </div>

      {/* Existing Assignments */}
      {assignments.length > 0 && (
        <div className="space-y-3">
          <h5 className="text-sm font-medium text-foreground">Previous Submissions</h5>
          {assignments.map(assignment => {
            const StatusIcon = getStatusIcon(assignment.status)
            return (
              <div key={assignment.id} className="p-4 bg-card rounded-lg border shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h6 className="font-medium text-foreground mb-1">{assignment.title}</h6>
                    {assignment.description && (
                      <p className="text-sm text-muted-foreground mb-2">{assignment.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        Submitted: {new Date(assignment.submitted_at || '').toLocaleDateString()}
                      </span>
                      {assignment.grade && (
                        <span className="text-accent font-medium">
                          Grade: {assignment.grade}/100
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(assignment.status)}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    <span className="capitalize">{assignment.status}</span>
                  </div>
                </div>

                {/* Files */}
                {assignment.files.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-foreground">Attached Files:</p>
                    {assignment.files.map((file, index) => {
                      const IconComponent = getFileIcon(file.type)
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <IconComponent className="h-3 w-3" />
                          <span>{file.name}</span>
                          <span>({formatFileSize(file.size)})</span>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Feedback */}
                {assignment.feedback && (
                  <div className="mt-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-xs font-medium text-primary mb-1">Instructor Feedback:</p>
                    <p className="text-sm text-primary/80">{assignment.feedback}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* New Assignment Submission */}
      {isCreating ? (
        <div className="p-4 bg-muted/50 rounded-lg border">
          <div className="space-y-4">
            <Input
              placeholder="Assignment title..."
              value={newAssignment.title}
              onChange={e => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
            />
            <Textarea
              placeholder="Description or notes about your submission..."
              value={newAssignment.description}
              onChange={e => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[80px]"
            />

            {/* File Upload Area */}
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop files here, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-muted-foreground/80">
                Supported: PDF, PPT, Excel, Images, Text, Markdown • Max 25MB each
              </p>
            </div>

            {/* Uploaded Files Preview */}
            {uploadFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Files to submit:</p>
                {uploadFiles.map((file, index) => {
                  const IconComponent = getFileIcon(file.type)
                  return (
                    <div key={index} className="flex items-center gap-3 p-2 bg-card rounded border">
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={submitAssignment}
                disabled={isSubmitting || (!newAssignment.title.trim() && uploadFiles.length === 0)}
                variant="ghost"
                className="!bg-gradient-to-r !from-orange-500 !to-red-500 hover:!from-orange-700 hover:!to-red-700 hover:scale-105 shadow-lg hover:shadow-xl !transition-all !duration-300 disabled:hover:scale-100 !text-white hover:!text-white will-change-transform"
                style={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transformOrigin: 'center',
                  color: 'white !important',
                }}
              >
                {isSubmitting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Assignment
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCreating(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.txt,.md"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      ) : (
        <Button
          onClick={() => setIsCreating(true)}
          variant="outline"
          className="w-full border-dashed border-2 border-secondary/30 hover:border-secondary/40 hover:bg-secondary/10 text-secondary"
        >
          <Upload className="h-4 w-4 mr-2" />
          Submit New Assignment
        </Button>
      )}

      {/* Help Text */}
      <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-primary">Assignment Guidelines</p>
            <ul className="text-xs text-primary/80 mt-1 space-y-1">
              <li>• Upload your completed work in supported formats</li>
              <li>• Include a clear title and description</li>
              <li>• Maximum file size: 25MB per file</li>
              <li>• You can submit multiple files for one assignment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
