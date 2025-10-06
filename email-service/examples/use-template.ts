/**
 * Example: Using Email Templates
 * 
 * This example shows how to use pre-built email templates.
 */

import { BrevoEmailService } from '../lib/brevo-service'
import { generateWelcomeEmail, generateInvitationEmail } from '../lib/email-templates'

async function sendWelcomeEmail() {
  const emailService = new BrevoEmailService(
    process.env.BREVO_API_KEY!
  )

  try {
    // Generate welcome email HTML
    const html = generateWelcomeEmail('John Doe', 'student')

    // Send welcome email
    const result = await emailService.sendEmail({
      to: 'john@example.com',
      subject: 'Welcome to Our Platform!',
      html
    })

    console.log('✅ Welcome email sent!')
    console.log('Message ID:', result.messageId)
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error)
  }
}

async function sendInvitationEmail() {
  const emailService = new BrevoEmailService(
    process.env.BREVO_API_KEY!
  )

  try {
    // Generate invitation email HTML
    const html = generateInvitationEmail({
      recipientName: 'Jane Smith',
      recipientEmail: 'jane@example.com',
      inviterName: 'John Doe',
      role: 'instructor',
      message: 'We would love to have you join our team as an instructor!',
      signupUrl: 'https://yourapp.com/signup?invite=abc123'
    })

    // Send invitation email
    const result = await emailService.sendEmail({
      to: 'jane@example.com',
      subject: 'You\'re Invited to Join Our Platform!',
      html
    })

    console.log('✅ Invitation email sent!')
    console.log('Message ID:', result.messageId)
  } catch (error) {
    console.error('❌ Failed to send invitation email:', error)
  }
}

// Run the examples
async function main() {
  console.log('Sending welcome email...')
  await sendWelcomeEmail()

  console.log('\nSending invitation email...')
  await sendInvitationEmail()
}

main()

