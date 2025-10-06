'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SettingsForm } from '@/components/settings/SettingsForm'
import { NotificationSettings } from '@/components/settings/NotificationSettings'
import { PrivacySettings } from '@/components/settings/PrivacySettings'
import { AppearanceSettings } from '@/components/settings/AppearanceSettings'
import { LanguageSettings } from '@/components/settings/LanguageSettings'
import { DataSettings } from '@/components/settings/DataSettings'
import { cn } from '@/lib/utils'
import { User, Bell, Shield, Palette, Globe, Database } from 'lucide-react'

interface SettingsContainerProps {
  user: any
  profile: any
  roles: any[]
}

type SettingsTab = 'profile' | 'notifications' | 'privacy' | 'appearance' | 'language' | 'data'

const settingsTabs = [
  {
    id: 'profile' as SettingsTab,
    name: 'Profile',
    icon: User,
    title: 'Profile Information',
    description: 'Update your personal information and profile settings',
  },
  {
    id: 'notifications' as SettingsTab,
    name: 'Notifications',
    icon: Bell,
    title: 'Notification Preferences',
    description: 'Choose how you want to be notified about course updates and activities',
  },
  {
    id: 'privacy' as SettingsTab,
    name: 'Privacy & Security',
    icon: Shield,
    title: 'Privacy & Security',
    description: 'Manage your privacy settings and account security',
  },
  {
    id: 'appearance' as SettingsTab,
    name: 'Appearance',
    icon: Palette,
    title: 'Appearance',
    description: 'Customize how the platform looks and feels',
  },
  {
    id: 'language' as SettingsTab,
    name: 'Language & Region',
    icon: Globe,
    title: 'Language & Region',
    description: 'Set your preferred language and regional settings',
  },
  {
    id: 'data' as SettingsTab,
    name: 'Data & Privacy',
    icon: Database,
    title: 'Data & Privacy',
    description: 'Manage your data and privacy preferences',
  },
]

export function SettingsContainer({ user, profile, roles }: SettingsContainerProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')

  const activeTabData = settingsTabs.find(tab => tab.id === activeTab)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <SettingsForm user={user} profile={profile} roles={roles} />
      case 'notifications':
        return <NotificationSettings userId={user.id} />
      case 'privacy':
        return <PrivacySettings userId={user.id} />
      case 'appearance':
        return <AppearanceSettings userId={user.id} />
      case 'language':
        return <LanguageSettings userId={user.id} />
      case 'data':
        return <DataSettings userId={user.id} />
      default:
        return <SettingsForm user={user} profile={profile} roles={roles} />
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Settings Navigation */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="space-y-1 pb-2">
              {settingsTabs.map(tab => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-all duration-200 relative group',
                      isActive
                        ? 'font-medium text-gray-900 bg-gradient-to-r from-blue-50 to-purple-50 border-r-3 border-blue-500 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-r-2 hover:border-gray-200'
                    )}
                  >
                    <div
                      className={cn(
                        'p-1.5 rounded-md transition-all duration-200',
                        isActive
                          ? 'bg-gradient-to-r from-blue-100 to-purple-100'
                          : 'group-hover:bg-gray-100'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-4 w-4 transition-colors',
                          isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                        )}
                      />
                    </div>
                    <span className="truncate">{tab.name}</span>
                    {isActive && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-l-full"></div>
                    )}
                  </button>
                )
              })}
            </nav>
          </CardContent>
        </Card>
      </div>

      {/* Settings Content */}
      <div className="lg:col-span-3">
        <Card className="min-h-[600px]">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-3">
              {activeTabData && (
                <>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                    <activeTabData.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  {activeTabData.title}
                </>
              )}
            </CardTitle>
            <CardDescription>{activeTabData?.description}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="animate-in fade-in-50 duration-300 slide-in-from-right-2">
              {renderTabContent()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
