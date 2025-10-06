/**
 * Default Email Configuration for TechShu SkillHub
 * Ensures the system always has a working email configuration
 */

import { createClient } from '@/lib/supabase/server'

export interface EmailConfig {
  id?: string
  provider: string
  smtp_host: string
  smtp_port: number
  smtp_username: string
  smtp_password: string
  brevo_api_key: string
  from_email: string
  from_name: string
  is_active: boolean
}

export const DEFAULT_EMAIL_CONFIG: Omit<EmailConfig, 'id'> = {
  provider: 'brevo',
  smtp_host: 'smtp-relay.brevo.com',
  smtp_port: 587,
  smtp_username: process.env.SMTP_USERNAME || 'your-smtp-username@smtp-brevo.com',
  smtp_password: process.env.SMTP_PASSWORD || 'your-smtp-password', // Set in .env file
  brevo_api_key:
    process.env.BREVO_API_KEY ||
    'your-brevo-api-key-here', // Set in .env file - Get from https://app.brevo.com/settings/keys/api
  from_email: process.env.FROM_EMAIL || 'your-email@example.com',
  from_name: process.env.FROM_NAME || 'Your App Name',
  is_active: true,
}

/**
 * Ensures a default email configuration exists in the database
 * This function is called when no active configuration is found
 */
export async function ensureDefaultEmailConfig(): Promise<EmailConfig> {
  const supabase = await createClient()

  // Check if any active configuration exists
  const { data: existingConfigs, error: fetchError } = await supabase
    .from('email_config')
    .select('*')
    .eq('is_active', true)
    .limit(1)

  if (fetchError) {
    console.error('Error checking email configuration:', fetchError)
    throw new Error('Failed to check email configuration')
  }

  // If configuration exists, return it
  if (existingConfigs && existingConfigs.length > 0) {
    return existingConfigs[0] as unknown as EmailConfig
  }

  // No active configuration found, create default one
  console.log('No active email configuration found, creating default configuration...')

  const { data: newConfig, error: insertError } = await supabase
    .from('email_config')
    .insert(DEFAULT_EMAIL_CONFIG)
    .select()
    .single()

  if (insertError) {
    console.error('Error creating default email configuration:', insertError)
    throw new Error('Failed to create default email configuration')
  }

  console.log('Default email configuration created successfully')
  return newConfig as unknown as EmailConfig
}

/**
 * Gets the active email configuration, creating default if none exists
 */
export async function getActiveEmailConfig(): Promise<EmailConfig> {
  const supabase = await createClient()

  const { data: emailConfigs, error: configError } = await supabase
    .from('email_config')
    .select('*')
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(1)

  if (configError) {
    console.error('Error fetching email configuration:', configError)
    throw new Error('Failed to fetch email configuration')
  }

  if (!emailConfigs || emailConfigs.length === 0) {
    // No active configuration found, create default
    return await ensureDefaultEmailConfig()
  }

  return emailConfigs[0] as unknown as EmailConfig
}

/**
 * Updates the email configuration
 * Always updates the existing record, never creates new ones
 */
export async function updateEmailConfig(updates: Partial<EmailConfig>): Promise<EmailConfig> {
  const supabase = await createClient()

  // Get the current active configuration
  const currentConfig = await getActiveEmailConfig()

  // Update the existing configuration
  const { data: updatedConfig, error: updateError } = await supabase
    .from('email_config')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', currentConfig.id!)
    .select()
    .single()

  if (updateError) {
    console.error('Error updating email configuration:', updateError)
    throw new Error('Failed to update email configuration')
  }

  return updatedConfig as unknown as EmailConfig
}
