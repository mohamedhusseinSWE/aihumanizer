import nodemailer from "nodemailer";

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use App Password for Gmail
  },
});

// Email templates
export const emailTemplates = {
  welcome: (userName: string, userEmail: string) => ({
    from: process.env.EMAIL_FROM || "noreply@aihumanizer.com",
    to: userEmail,
    subject: "🎉 Welcome to AI Humanizer - Start Humanizing Your Content!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to AI Humanizer</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
          .content { padding: 40px 30px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .features { background: #f8fafc; padding: 30px; margin: 20px 0; border-radius: 8px; }
          .feature-item { margin: 15px 0; padding-left: 25px; position: relative; }
          .feature-item::before { content: "✓"; position: absolute; left: 0; color: #10b981; font-weight: bold; }
          .footer { background: #f8fafc; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Welcome to AI Humanizer!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Hi ${userName}, we're excited to have you on board!</p>
          </div>
          
          <div class="content">
            <h2 style="color: #1f2937; margin-top: 0;">Ready to transform your AI content?</h2>
            <p>Thank you for joining AI Humanizer! You now have access to our powerful AI humanization tools that will help you create content that bypasses AI detection while maintaining natural, human-like quality.</p>
            
            <div class="features">
              <h3 style="color: #1f2937; margin-top: 0;">What you can do now:</h3>
              <div class="feature-item">Humanize AI-generated text with our advanced algorithms</div>
              <div class="feature-item">Bypass AI detection tools like GPTZero, Turnitin, and more</div>
              <div class="feature-item">Maintain natural writing style and readability</div>
              <div class="feature-item">Process up to 300 words per request on the free plan</div>
              <div class="feature-item">Access your personal dashboard to track usage</div>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard" class="button">
                Go to Dashboard
              </a>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
              Need help getting started? Check out our <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/help" style="color: #667eea;">help center</a> or reply to this email.
            </p>
          </div>
          
          <div class="footer">
            <p>© 2024 AI Humanizer. All rights reserved.</p>
            <p>This email was sent to ${userEmail}. If you didn't create an account, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  paymentSuccess: (
    userName: string,
    userEmail: string,
    planName: string,
    amount: number,
  ) => ({
    from: process.env.EMAIL_FROM || "noreply@aihumanizer.com",
    to: userEmail,
    subject: "✅ Payment Successful - Welcome to Pro Plan!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Successful</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 30px; text-align: center; }
          .content { padding: 40px 30px; }
          .button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .success-box { background: #f0fdf4; border: 2px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .plan-details { background: #f8fafc; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #10b981; }
          .footer { background: #f8fafc; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">🎉 Payment Successful!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Hi ${userName}, your upgrade is complete!</p>
          </div>
          
          <div class="content">
            <div class="success-box">
              <h2 style="color: #10b981; margin-top: 0;">✅ Your payment has been processed successfully!</h2>
              <p style="margin: 0; font-size: 18px; font-weight: 600;">Welcome to the ${planName} plan!</p>
            </div>
            
            <div class="plan-details">
              <h3 style="color: #1f2937; margin-top: 0;">Plan Details:</h3>
              <p><strong>Plan:</strong> ${planName}</p>
              <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
              <p><strong>Status:</strong> Active</p>
              <p><strong>Next Billing:</strong> Next month (if applicable)</p>
            </div>
            
            <h3 style="color: #1f2937;">What's included in your Pro plan:</h3>
            <ul style="color: #4b5563;">
              <li>Unlimited AI text humanization</li>
              <li>Enhanced model access</li>
              <li>Priority support</li>
              <li>Advanced features and tools</li>
              <li>No word limits per request</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard" class="button">
                Access Your Dashboard
              </a>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
              Questions about your subscription? Contact us at <a href="mailto:support@aihumanizer.com" style="color: #10b981;">support@aihumanizer.com</a>
            </p>
          </div>
          
          <div class="footer">
            <p>© 2024 AI Humanizer. All rights reserved.</p>
            <p>This email was sent to ${userEmail}. Keep this email for your records.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

// Email sending functions
export const sendWelcomeEmail = async (userName: string, userEmail: string) => {
  try {
    const template = emailTemplates.welcome(userName, userEmail);
    await transporter.sendMail(template);
    console.log("✅ Welcome email sent to:", userEmail);
    return { success: true };
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error);
    return { success: false, error };
  }
};

export const sendPaymentSuccessEmail = async (
  userName: string,
  userEmail: string,
  planName: string,
  amount: number,
) => {
  try {
    const template = emailTemplates.paymentSuccess(
      userName,
      userEmail,
      planName,
      amount,
    );
    await transporter.sendMail(template);
    console.log("✅ Payment success email sent to:", userEmail);
    return { success: true };
  } catch (error) {
    console.error("❌ Failed to send payment success email:", error);
    return { success: false, error };
  }
};

// Test email function
export const sendTestEmail = async (to: string) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@aihumanizer.com",
      to,
      subject: "Test Email from AI Humanizer",
      html: "<h1>Test Email</h1><p>This is a test email to verify email configuration.</p>",
    });
    console.log("✅ Test email sent to:", to);
    return { success: true };
  } catch (error) {
    console.error("❌ Failed to send test email:", error);
    return { success: false, error };
  }
};
