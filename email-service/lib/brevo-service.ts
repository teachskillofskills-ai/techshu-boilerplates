/**
 * Brevo Email Service
 * Handles email sending using Brevo (formerly Sendinblue) API
 */

import * as brevo from '@getbrevo/brevo'

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
  fromName?: string
  replyTo?: string
}

interface EmailResponse {
  messageId: string
  success: boolean
}

export class BrevoEmailService {
  private apiKey: string
  private defaultFrom: string
  private defaultFromName: string

  constructor(
    apiKey: string,
    defaultFrom = 'skillhubbytechsu@gmail.com',
    defaultFromName = 'TechShu SkillHub'
  ) {
    this.apiKey = apiKey
    this.defaultFrom = defaultFrom
    this.defaultFromName = defaultFromName
  }

  /**
   * Send a single email using fetch API
   */
  async sendEmail(options: EmailOptions): Promise<EmailResponse> {
    try {
      const { to, subject, html, from, fromName, replyTo } = options

      // Prepare recipients
      const recipients = Array.isArray(to) ? to.map(email => ({ email })) : [{ email: to }]

      // Prepare sender
      const sender = {
        email: from || this.defaultFrom,
        name: fromName || this.defaultFromName,
      }

      // Prepare email data
      const emailData = {
        sender,
        to: recipients,
        subject,
        htmlContent: html,
        ...(replyTo && { replyTo: { email: replyTo } }),
      }

      console.log('Sending email via Brevo:', {
        to: recipients.map(r => r.email),
        subject,
        from: sender,
      })

      // Send email using fetch API
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'api-key': this.apiKey,
        },
        body: JSON.stringify(emailData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Brevo API error: ${JSON.stringify(errorData)}`)
      }

      const result = await response.json()

      return {
        messageId: result.messageId || 'brevo-' + Date.now(),
        success: true,
      }
    } catch (error) {
      console.error('Brevo email send error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to send email via Brevo: ${errorMessage}`)
    }
  }

  /**
   * Send bulk emails (multiple recipients)
   */
  async sendBulkEmail(options: EmailOptions): Promise<EmailResponse> {
    return this.sendEmail(options)
  }

  /**
   * Test the Brevo connection using fetch API
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch('https://api.brevo.com/v3/account', {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'api-key': this.apiKey,
        },
      })
      return response.ok
    } catch (error) {
      console.error('Brevo connection test failed:', error)
      return false
    }
  }

  /**
   * Get account information using fetch API
   */
  async getAccountInfo(): Promise<any> {
    try {
      const response = await fetch('https://api.brevo.com/v3/account', {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'api-key': this.apiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to get account info: ${response.status}`)
      }

      const account = await response.json()
      return {
        email: account.email,
        firstName: account.firstName,
        lastName: account.lastName,
        companyName: account.companyName,
        plan: account.plan?.type,
        credits: account.plan?.creditsType,
      }
    } catch (error) {
      console.error('Error getting Brevo account info:', error)
      throw error
    }
  }

  /**
   * Send test email
   */
  async sendTestEmail(toEmail: string): Promise<EmailResponse> {
    const testEmailOptions: EmailOptions = {
      to: toEmail,
      subject: 'TechShu SkillHub - Brevo Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #28a745;">✅ Brevo Email Test Successful!</h2>
          <p>This email confirms that your Brevo email integration is working correctly with TechShu SkillHub.</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #555;">Email Service Details:</h3>
            <p style="margin: 5px 0;"><strong>Provider:</strong> Brevo (formerly Sendinblue)</p>
            <p style="margin: 5px 0;"><strong>From Email:</strong> ${this.defaultFrom}</p>
            <p style="margin: 5px 0;"><strong>From Name:</strong> ${this.defaultFromName}</p>
            <p style="margin: 5px 0;"><strong>API Integration:</strong> Active</p>
          </div>
          
          <p>✅ Email sending functionality is now working!</p>
          <p style="color: #666; font-size: 14px;">Test performed at: ${new Date().toLocaleString()}</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">
            This is an automated test email from TechShu SkillHub Learning Management System.
          </p>
        </div>
      `,
    }

    return this.sendEmail(testEmailOptions)
  }
}
