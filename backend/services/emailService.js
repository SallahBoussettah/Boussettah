const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Gmail SMTP configuration
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL || process.env.ADMIN_EMAIL,
        pass: process.env.SMTP_APP_PASSWORD // This will be the Google App Password
      }
    });
  }

  async sendContactNotification(contactData) {
    try {
      const { name, email, subject, message } = contactData;
      
      const mailOptions = {
        from: process.env.SMTP_EMAIL || process.env.ADMIN_EMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #495057; margin-top: 0;">Contact Details</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
              <h3 style="color: #495057; margin-top: 0;">Message</h3>
              <p style="line-height: 1.6; color: #6c757d;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #e9ecef; border-radius: 5px;">
              <p style="margin: 0; font-size: 14px; color: #6c757d;">
                <strong>Reply to:</strong> <a href="mailto:${email}">${email}</a>
              </p>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #868e96;">
                Sent from your portfolio contact form
              </p>
            </div>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Contact notification email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending contact notification email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendAutoReply(contactData) {
    try {
      const { name, email, subject } = contactData;
      
      const mailOptions = {
        from: process.env.SMTP_EMAIL || process.env.ADMIN_EMAIL,
        to: email,
        subject: `Thank you for contacting me - ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              Thank You for Your Message
            </h2>
            
            <p style="font-size: 16px; color: #495057;">Hi ${name},</p>
            
            <p style="line-height: 1.6; color: #6c757d;">
              Thank you for reaching out! I've received your message about "<strong>${subject}</strong>" 
              and I appreciate you taking the time to contact me.
            </p>
            
            <p style="line-height: 1.6; color: #6c757d;">
              I'll review your message and get back to you as soon as possible, usually within 24-48 hours.
            </p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #495057;">
                <strong>In the meantime, feel free to:</strong>
              </p>
              <ul style="color: #6c757d; margin: 10px 0;">
                <li>Check out my latest projects on my portfolio</li>
                <li>Connect with me on social media</li>
                <li>Browse my blog for insights and updates</li>
              </ul>
            </div>
            
            <p style="line-height: 1.6; color: #6c757d;">
              Best regards,<br>
              <strong>Salah Eddine Boussettah</strong><br>
              <em>Full Stack Developer & Digital Artist</em>
            </p>
            
            <div style="margin-top: 30px; padding: 15px; background-color: #e9ecef; border-radius: 5px; font-size: 12px; color: #868e96;">
              <p style="margin: 0;">
                This is an automated response. Please do not reply to this email directly.
                If you need immediate assistance, please send a new message through the contact form.
              </p>
            </div>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Auto-reply email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending auto-reply email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendPasswordResetCode(email, resetCode) {
    try {
      const mailOptions = {
        from: process.env.SMTP_EMAIL || process.env.ADMIN_EMAIL,
        to: email,
        subject: 'Password Reset Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              Password Reset Request
            </h2>
            
            <p style="font-size: 16px; color: #495057;">Hello,</p>
            
            <p style="line-height: 1.6; color: #6c757d;">
              You have requested to reset your admin password. Please use the verification code below to proceed:
            </p>
            
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin: 30px 0; text-align: center;">
              <h1 style="color: #007bff; font-size: 48px; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${resetCode}
              </h1>
              <p style="color: #6c757d; margin: 10px 0 0 0; font-size: 14px;">
                This code will expire in 15 minutes
              </p>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email. 
                Your password will remain unchanged.
              </p>
            </div>
            
            <p style="line-height: 1.6; color: #6c757d;">
              Best regards,<br>
              <strong>Portfolio Security System</strong>
            </p>
            
            <div style="margin-top: 30px; padding: 15px; background-color: #e9ecef; border-radius: 5px; font-size: 12px; color: #868e96;">
              <p style="margin: 0;">
                This is an automated security email. Please do not reply to this email directly.
              </p>
            </div>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Password reset code email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending password reset code email:', error);
      return { success: false, error: error.message };
    }
  }

  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ SMTP connection verified successfully');
      return true;
    } catch (error) {
      console.error('❌ SMTP connection failed:', error);
      return false;
    }
  }
}

module.exports = new EmailService();