/**
 * Example: Basic Email Sending
 * 
 * This example shows how to send a simple email using the Brevo service.
 */

import { BrevoEmailService } from '../lib/brevo-service'

async function sendBasicEmail() {
  // Initialize the email service
  const emailService = new BrevoEmailService(
    process.env.BREVO_API_KEY!,
    'your@email.com',
    'Your App Name'
  )

  try {
    // Send a simple email
    const result = await emailService.sendEmail({
      to: 'recipient@example.com',
      subject: 'Hello from Your App',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1>Hello!</h1>
          <p>This is a test email from your application.</p>
          <p>If you received this, your email service is working correctly!</p>
        </div>
      `
    })

    console.log('✅ Email sent successfully!')
    console.log('Message ID:', result.messageId)
  } catch (error) {
    console.error('❌ Failed to send email:', error)
  }
}

// Run the example
sendBasicEmail()

