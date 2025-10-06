/**
 * Example: Bulk Email Sending
 * 
 * This example shows how to send emails to multiple recipients.
 */

import { BrevoEmailService } from '../lib/brevo-service'

async function sendBulkEmail() {
  const emailService = new BrevoEmailService(
    process.env.BREVO_API_KEY!,
    'your@email.com',
    'Your App Name'
  )

  try {
    // Send to multiple recipients
    const result = await emailService.sendBulkEmail({
      to: [
        'user1@example.com',
        'user2@example.com',
        'user3@example.com'
      ],
      subject: 'Important Announcement',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1>📢 Important Announcement</h1>
          <p>We have an important update to share with you.</p>
          <p>This email was sent to multiple recipients using bulk sending.</p>
          <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>What's New:</h3>
            <ul>
              <li>Feature 1: New dashboard</li>
              <li>Feature 2: Improved performance</li>
              <li>Feature 3: Better user experience</li>
            </ul>
          </div>
          <p>Thank you for being part of our community!</p>
        </div>
      `
    })

    console.log('✅ Bulk email sent successfully!')
    console.log('Message ID:', result.messageId)
  } catch (error) {
    console.error('❌ Failed to send bulk email:', error)
  }
}

// Run the example
sendBulkEmail()

