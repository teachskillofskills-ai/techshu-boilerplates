# 📧 Email Service Boilerplate (Brevo)

A complete email service integration with Brevo (formerly Sendinblue) for sending transactional emails, bulk emails, and managing email templates.

## ✨ Features

- ✅ Brevo API integration
- ✅ Transactional emails
- ✅ Bulk email sending
- ✅ Beautiful HTML email templates
- ✅ Email configuration management
- ✅ Connection testing
- ✅ Account information retrieval
- ✅ SMTP fallback support
- ✅ Template system
- ✅ Error handling

## 📦 Installation

### 1. Install Dependencies

```bash
npm install @getbrevo/brevo
```

### 2. Environment Variables

Create a `.env.local` file:

```env
# Brevo Configuration
BREVO_API_KEY=your_brevo_api_key
FROM_EMAIL=your@email.com
FROM_NAME=Your App Name

# Optional SMTP Fallback
SMTP_USERNAME=your_smtp_username
SMTP_PASSWORD=your_smtp_password
```

### 3. Get Brevo API Key

1. Sign up at [Brevo](https://www.brevo.com/)
2. Go to Settings → API Keys
3. Create a new API key
4. Copy the key to your `.env.local`

### 4. Database Setup (Optional)

If you want to store email configuration in database:

```bash
psql -f database/email_config_table.sql
```

## 📁 File Structure

```
email-service/
├── README.md
├── lib/
│   ├── brevo-service.ts        # Main Brevo service
│   ├── email-templates.ts      # Email templates
│   └── email-config.ts         # Configuration management
├── database/
│   └── email_config_table.sql  # Email config table
├── examples/
│   ├── send-email.ts
│   ├── send-bulk.ts
│   ├── use-template.ts
│   └── test-connection.ts
└── .env.example
```

## 🚀 Quick Start

### Basic Email Sending

```typescript
import { BrevoEmailService } from './lib/brevo-service'

// Initialize service
const emailService = new BrevoEmailService(
  process.env.BREVO_API_KEY!,
  'your@email.com',
  'Your App Name'
)

// Send email
await emailService.sendEmail({
  to: 'recipient@example.com',
  subject: 'Hello from Your App',
  html: '<h1>Hello!</h1><p>This is a test email.</p>'
})
```

### Using Email Templates

```typescript
import { BrevoEmailService } from './lib/brevo-service'
import { generateWelcomeEmail } from './lib/email-templates'

const emailService = new BrevoEmailService(
  process.env.BREVO_API_KEY!
)

// Generate HTML from template
const html = generateWelcomeEmail('John Doe', 'student')

// Send email
await emailService.sendEmail({
  to: 'john@example.com',
  subject: 'Welcome to Our Platform!',
  html
})
```

### Invitation Email

```typescript
import { generateInvitationEmail } from './lib/email-templates'

const html = generateInvitationEmail({
  recipientName: 'Jane Smith',
  recipientEmail: 'jane@example.com',
  inviterName: 'John Doe',
  role: 'instructor',
  message: 'Looking forward to having you on the team!',
  signupUrl: 'https://yourapp.com/signup'
})

await emailService.sendEmail({
  to: 'jane@example.com',
  subject: 'You\'re Invited!',
  html
})
```

### Bulk Email Sending

```typescript
// Send to multiple recipients
await emailService.sendBulkEmail({
  to: ['user1@example.com', 'user2@example.com', 'user3@example.com'],
  subject: 'Important Announcement',
  html: '<h1>Announcement</h1><p>Important message here...</p>'
})
```

### Test Connection

```typescript
// Test if Brevo API is working
const isConnected = await emailService.testConnection()
console.log('Brevo connected:', isConnected)

// Get account information
const accountInfo = await emailService.getAccountInfo()
console.log('Account:', accountInfo)
```

### Send Test Email

```typescript
// Send a test email to verify setup
await emailService.sendTestEmail('your@email.com')
```

## 🎨 Email Templates

### Available Templates

1. **Welcome Email** - User registration confirmation
2. **Invitation Email** - Invite users to platform
3. **Custom Templates** - Create your own

### Creating Custom Templates

```typescript
// lib/email-templates.ts

export function generateCustomEmail(data: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 6px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${data.title}</h1>
        <p>${data.message}</p>
        <a href="${data.actionUrl}" class="button">${data.actionText}</a>
    </div>
</body>
</html>
  `
}
```

## 🔧 Configuration Management

### Using Database Configuration

```typescript
import { getActiveEmailConfig } from './lib/email-config'

// Get active configuration from database
const config = await getActiveEmailConfig()

// Initialize service with database config
const emailService = new BrevoEmailService(
  config.brevo_api_key,
  config.from_email,
  config.from_name
)
```

### Update Configuration

```typescript
import { updateEmailConfig } from './lib/email-config'

await updateEmailConfig({
  from_email: 'newemail@example.com',
  from_name: 'New Name',
  brevo_api_key: 'new_api_key'
})
```

## 📊 API Reference

### BrevoEmailService

#### Constructor

```typescript
new BrevoEmailService(
  apiKey: string,
  defaultFrom?: string,
  defaultFromName?: string
)
```

#### Methods

**sendEmail(options: EmailOptions): Promise<EmailResponse>**
```typescript
await emailService.sendEmail({
  to: 'user@example.com',
  subject: 'Subject',
  html: '<p>Content</p>',
  from?: 'custom@email.com',
  fromName?: 'Custom Name',
  replyTo?: 'reply@email.com'
})
```

**sendBulkEmail(options: EmailOptions): Promise<EmailResponse>**
```typescript
await emailService.sendBulkEmail({
  to: ['user1@example.com', 'user2@example.com'],
  subject: 'Bulk Email',
  html: '<p>Content</p>'
})
```

**testConnection(): Promise<boolean>**
```typescript
const isConnected = await emailService.testConnection()
```

**getAccountInfo(): Promise<AccountInfo>**
```typescript
const info = await emailService.getAccountInfo()
// Returns: { email, firstName, lastName, companyName, plan, credits }
```

**sendTestEmail(toEmail: string): Promise<EmailResponse>**
```typescript
await emailService.sendTestEmail('test@example.com')
```

## 🔒 Security Best Practices

1. **Never expose API keys** - Keep them in environment variables
2. **Validate email addresses** - Check format before sending
3. **Rate limiting** - Implement rate limits for bulk sending
4. **Sanitize HTML** - Clean user-generated HTML content
5. **Use HTTPS** - Always use secure connections
6. **Monitor usage** - Track email sending for abuse

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Invalid API key"
- **Solution**: Check your Brevo API key in `.env.local`
- Verify the key is active in Brevo dashboard

**Issue**: "Email not delivered"
- **Solution**: Check spam folder
- Verify sender email is verified in Brevo
- Check Brevo logs for delivery status

**Issue**: "Rate limit exceeded"
- **Solution**: Upgrade Brevo plan
- Implement rate limiting in your app
- Use bulk sending for multiple recipients

**Issue**: "HTML not rendering"
- **Solution**: Test HTML in email client
- Use inline CSS for better compatibility
- Avoid complex CSS and JavaScript

## 📈 Best Practices

### Email Design

1. **Keep it simple** - Clean, focused design
2. **Mobile-first** - Responsive templates
3. **Clear CTA** - Obvious call-to-action buttons
4. **Brand consistency** - Use your brand colors
5. **Test thoroughly** - Test in multiple email clients

### Sending Strategy

1. **Personalization** - Use recipient names
2. **Timing** - Send at optimal times
3. **Segmentation** - Target specific user groups
4. **A/B testing** - Test subject lines and content
5. **Analytics** - Track open and click rates

### Template Management

1. **Reusable components** - Create modular templates
2. **Version control** - Track template changes
3. **Testing** - Test all templates before use
4. **Documentation** - Document template variables
5. **Fallbacks** - Plain text versions

## 🧪 Testing

### Test Email Sending

```typescript
import { BrevoEmailService } from './lib/brevo-service'

describe('Email Service', () => {
  const emailService = new BrevoEmailService(
    process.env.BREVO_API_KEY!
  )

  test('sends email successfully', async () => {
    const result = await emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Test',
      html: '<p>Test</p>'
    })

    expect(result.success).toBe(true)
    expect(result.messageId).toBeDefined()
  })

  test('tests connection', async () => {
    const isConnected = await emailService.testConnection()
    expect(isConnected).toBe(true)
  })
})
```

## 📚 Examples

Check the `examples/` folder for:
- Basic email sending
- Bulk email sending
- Using templates
- Testing connection
- Error handling
- Configuration management

## 🔄 Migration from Other Services

### From SendGrid

```typescript
// SendGrid
await sgMail.send({
  to: 'user@example.com',
  from: 'sender@example.com',
  subject: 'Subject',
  html: '<p>Content</p>'
})

// Brevo (same interface!)
await emailService.sendEmail({
  to: 'user@example.com',
  from: 'sender@example.com',
  subject: 'Subject',
  html: '<p>Content</p>'
})
```

### From Nodemailer

```typescript
// Nodemailer
await transporter.sendMail({
  from: 'sender@example.com',
  to: 'user@example.com',
  subject: 'Subject',
  html: '<p>Content</p>'
})

// Brevo
await emailService.sendEmail({
  to: 'user@example.com',
  subject: 'Subject',
  html: '<p>Content</p>'
})
```

## 📖 Resources

- [Brevo Documentation](https://developers.brevo.com/)
- [Brevo API Reference](https://developers.brevo.com/reference)
- [Email Best Practices](https://www.brevo.com/blog/email-best-practices/)
- [HTML Email Guide](https://www.campaignmonitor.com/css/)

---

**Need help?** Check the examples folder for complete implementations.

