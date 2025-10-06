// Email templates for TechShu LMS

export interface InvitationEmailData {
  recipientName: string
  recipientEmail: string
  inviterName: string
  role: string
  message?: string
  signupUrl: string
}

export function generateInvitationEmail(data: InvitationEmailData): string {
  const { recipientName, recipientEmail, inviterName, role, message, signupUrl } = data

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to TechShu SkillHub</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #666;
            font-size: 16px;
        }
        .content {
            margin: 30px 0;
        }
        .role-badge {
            display: inline-block;
            padding: 6px 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            text-transform: capitalize;
        }
        .cta-button {
            display: inline-block;
            padding: 15px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
            transition: transform 0.2s;
        }
        .cta-button:hover {
            transform: translateY(-2px);
        }
        .message-box {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .features {
            margin: 30px 0;
        }
        .feature {
            display: flex;
            align-items: center;
            margin: 15px 0;
        }
        .feature-icon {
            width: 24px;
            height: 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            margin-right: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">TechShu SkillHub</div>
            <div class="subtitle">Your Learning Journey Starts Here</div>
        </div>

        <div class="content">
            <h2>🎉 You're Invited to Join TechShu SkillHub!</h2>
            
            <p>Hello ${recipientName || 'there'},</p>
            
            <p><strong>${inviterName}</strong> has invited you to join <strong>TechShu SkillHub</strong> as a <span class="role-badge">${role}</span>.</p>

            ${
              message
                ? `
            <div class="message-box">
                <strong>Personal Message:</strong><br>
                ${message}
            </div>
            `
                : ''
            }

            <div class="features">
                <h3>What you'll get access to:</h3>
                
                ${
                  role === 'super_admin'
                    ? `
                <div class="feature">
                    <div class="feature-icon">👑</div>
                    <div>Full system administration and management capabilities</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">🛡️</div>
                    <div>User management and role assignment</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">📊</div>
                    <div>Advanced analytics and reporting</div>
                </div>
                `
                    : ''
                }
                
                ${
                  role === 'admin'
                    ? `
                <div class="feature">
                    <div class="feature-icon">🛡️</div>
                    <div>User management and course oversight</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">📊</div>
                    <div>Analytics and progress tracking</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">⚙️</div>
                    <div>System configuration and settings</div>
                </div>
                `
                    : ''
                }
                
                ${
                  role === 'instructor'
                    ? `
                <div class="feature">
                    <div class="feature-icon">📚</div>
                    <div>Create and manage courses</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">🎓</div>
                    <div>Track student progress and engagement</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">💬</div>
                    <div>Interact with students and provide feedback</div>
                </div>
                `
                    : ''
                }
                
                ${
                  role === 'student'
                    ? `
                <div class="feature">
                    <div class="feature-icon">🎓</div>
                    <div>Access to premium courses and content</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">🤖</div>
                    <div>AI-powered learning assistant and tutor</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">📝</div>
                    <div>Interactive assignments and assessments</div>
                </div>
                `
                    : ''
                }
                
                <div class="feature">
                    <div class="feature-icon">🤖</div>
                    <div>AI-powered learning tools and assistance</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">📱</div>
                    <div>Mobile-friendly platform access</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">🔒</div>
                    <div>Secure and personalized learning environment</div>
                </div>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="${signupUrl}" class="cta-button">
                    🚀 Join TechShu SkillHub Now
                </a>
            </div>

            <p><strong>Getting Started:</strong></p>
            <ol>
                <li>Click the button above to access the platform</li>
                <li>Sign up using this email address: <strong>${recipientEmail}</strong></li>
                <li>You'll be automatically assigned the <strong>${role}</strong> role</li>
                <li>Start exploring your personalized dashboard</li>
            </ol>

            <p>If you have any questions, feel free to reach out to our support team or reply to this email.</p>

            <p>Welcome to the future of learning!</p>
            
            <p>Best regards,<br>
            <strong>The TechShu SkillHub Team</strong></p>
        </div>

        <div class="footer">
            <p>This invitation was sent to ${recipientEmail}</p>
            <p>TechShu SkillHub - Empowering Skills, Enabling Success</p>
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
        </div>
    </div>
</body>
</html>
  `.trim()
}

export function generateWelcomeEmail(userName: string, role: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to TechShu SkillHub</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Welcome to TechShu SkillHub!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Your learning journey begins now</p>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
        <h2>Hello ${userName}! 🎉</h2>
        
        <p>Congratulations! Your account has been successfully created and you've been assigned the <strong>${role}</strong> role.</p>
        
        <p>You now have access to all the features and capabilities associated with your role. Start exploring and make the most of your TechShu SkillHub experience!</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://tech-shu-lms.vercel.app/dashboard" style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
                Go to Dashboard
            </a>
        </div>
        
        <p>If you have any questions, our support team is here to help!</p>
        
        <p>Best regards,<br>
        <strong>The TechShu SkillHub Team</strong></p>
    </div>
</body>
</html>
  `.trim()
}
