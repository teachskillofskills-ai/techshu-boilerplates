'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, Save, User, Mail, Calendar, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface SettingsFormProps {
  user: any
  profile: any
  roles: any[]
}

export function SettingsForm({ user, profile, roles }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    website: profile?.website || '',
    location: profile?.location || '',
    phone: profile?.phone || '',
    avatar_url: profile?.avatar_url || '',
  })

  const supabase = createClient()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.full_name?.trim()) {
        toast.error('Full name is required')
        return
      }

      console.log('Updating profile for user:', user.id)
      console.log('Update data:', formData)

      const updateData = {
        ...formData,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Profile updated successfully:', data)
      toast.success('Profile updated successfully!')

      // Refresh the page to show updated data
      setTimeout(() => window.location.reload(), 1000)
    } catch (error: any) {
      console.error('Error updating profile:', error)
      console.error('Error details:', {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
      })

      // Provide more specific error messages
      if (error?.message?.includes('duplicate')) {
        toast.error('This information is already in use.')
      } else if (error?.message?.includes('permission')) {
        toast.error('Permission denied. Please try logging out and back in.')
      } else if (error?.code === 'PGRST116') {
        toast.error('Profile not found. Please try refreshing the page.')
      } else {
        toast.error(`Failed to update profile: ${error?.message || 'Unknown error'}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    setIsLoading(true)

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}` // Remove subfolder for now

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true, // Allow overwriting existing files
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)

        // If bucket doesn't exist, try to create it or use a fallback
        if (uploadError.message?.includes('Bucket not found')) {
          toast.error('Storage bucket not configured. Please contact support.')
          return
        }

        throw uploadError
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath)

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (updateError) {
        console.error('Profile update error:', updateError)
        throw updateError
      }

      setFormData(prev => ({ ...prev, avatar_url: publicUrl }))
      toast.success('Avatar updated successfully!')

      // Refresh the page to show the new avatar
      setTimeout(() => window.location.reload(), 1000)
    } catch (error: any) {
      console.error('Error uploading avatar:', error)

      // Provide more specific error messages
      if (error.message?.includes('Bucket not found')) {
        toast.error('Storage not configured. Please contact support.')
      } else if (error.message?.includes('permission')) {
        toast.error('Permission denied. Please try again or contact support.')
      } else if (error.message?.includes('size')) {
        toast.error('File too large. Please use a smaller image.')
      } else {
        toast.error('Failed to upload avatar. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={formData.avatar_url} alt={formData.full_name} />
          <AvatarFallback className="text-lg">
            {formData.full_name
              ?.split(' ')
              .map((n: string) => n[0])
              .join('') || 'U'}
          </AvatarFallback>
        </Avatar>

        <div>
          <h3 className="font-medium text-gray-900 mb-2">Profile Picture</h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload a new profile picture. JPG, PNG or GIF (max 2MB)
          </p>
          <div className="flex items-center gap-3">
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New
                </span>
              </Button>
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            {formData.avatar_url && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFormData(prev => ({ ...prev, avatar_url: '' }))}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Account Information */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-4 w-4" />
            Account Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="mt-1 bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={e => handleInputChange('full_name', e.target.value)}
                placeholder="Enter your full name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={e => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={e => handleInputChange('location', e.target.value)}
                placeholder="City, Country"
                className="mt-1"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={e => handleInputChange('website', e.target.value)}
                placeholder="https://your-website.com"
                className="mt-1"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={e => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Details */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Account Details
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Verified
                </h4>
                <p className="text-sm text-gray-600">Your email address is verified</p>
              </div>
              <Badge variant="default">Verified</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Member Since
                </h4>
                <p className="text-sm text-gray-600">
                  {new Date(profile?.created_at || user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Account Status</h4>
                <p className="text-sm text-gray-600">
                  {profile?.approval_status === 'approved'
                    ? 'Active and approved'
                    : 'Pending approval'}
                </p>
              </div>
              <Badge variant={profile?.approval_status === 'approved' ? 'default' : 'secondary'}>
                {profile?.approval_status === 'approved' ? 'Active' : 'Pending'}
              </Badge>
            </div>

            <div>
              <h4 className="font-medium mb-2">Roles</h4>
              <div className="flex flex-wrap gap-2">
                {roles.length > 0 ? (
                  roles.map((role, index) => (
                    <Badge key={index} variant="outline">
                      {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary">Student</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}
