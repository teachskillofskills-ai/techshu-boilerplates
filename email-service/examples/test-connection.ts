/**
 * Example: Testing Email Service Connection
 * 
 * This example shows how to test the Brevo connection and send a test email.
 */

import { BrevoEmailService } from '../lib/brevo-service'

async function testEmailService() {
  const emailService = new BrevoEmailService(
    process.env.BREVO_API_KEY!,
    'your@email.com',
    'Your App Name'
  )

  console.log('🔍 Testing Brevo email service...\n')

  // Test 1: Connection Test
  console.log('1️⃣ Testing connection...')
  try {
    const isConnected = await emailService.testConnection()
    if (isConnected) {
      console.log('✅ Connection successful!')
    } else {
      console.log('❌ Connection failed!')
      return
    }
  } catch (error) {
    console.error('❌ Connection test error:', error)
    return
  }

  // Test 2: Get Account Info
  console.log('\n2️⃣ Getting account information...')
  try {
    const accountInfo = await emailService.getAccountInfo()
    console.log('✅ Account info retrieved:')
    console.log('   Email:', accountInfo.email)
    console.log('   Name:', `${accountInfo.firstName} ${accountInfo.lastName}`)
    console.log('   Company:', accountInfo.companyName)
    console.log('   Plan:', accountInfo.plan)
    console.log('   Credits:', accountInfo.credits)
  } catch (error) {
    console.error('❌ Failed to get account info:', error)
  }

  // Test 3: Send Test Email
  console.log('\n3️⃣ Sending test email...')
  const testEmail = process.env.TEST_EMAIL || 'your@email.com'
  
  try {
    const result = await emailService.sendTestEmail(testEmail)
    console.log('✅ Test email sent successfully!')
    console.log('   Message ID:', result.messageId)
    console.log('   Check your inbox:', testEmail)
  } catch (error) {
    console.error('❌ Failed to send test email:', error)
  }

  console.log('\n🎉 Email service testing complete!')
}

// Run the test
testEmailService()

