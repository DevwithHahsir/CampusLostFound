// Email Service for sending verification codes
// This is a simple implementation - in production, use EmailJS, SendGrid, or similar service

class EmailService {
  static async sendVerificationEmail(email, verificationCode, universityName) {
    try {
      // Simulate email sending - Replace this with actual email service
      const emailContent = {
        to: email,
        subject: "Campus Lost Found - Email Verification",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #3B74D5; margin-bottom: 10px;">Campus Lost Found</h1>
              <p style="color: #666; font-size: 16px;">Email Verification Required</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
              <h2 style="color: #333; margin-bottom: 15px;">Welcome to Campus Lost Found!</h2>
              <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                Thank you for signing up with your ${universityName} email. To complete your registration, 
                please verify your email address using the code below:
              </p>
              
              <div style="text-align: center; margin: 25px 0;">
                <div style="display: inline-block; background: linear-gradient(45deg, #3B74D5, #59B888); 
                           color: white; padding: 15px 30px; border-radius: 8px; font-size: 24px; 
                           font-weight: bold; letter-spacing: 3px;">
                  ${verificationCode}
                </div>
              </div>
              
              <p style="color: #555; line-height: 1.6; margin-bottom: 15px;">
                This verification code will expire in 10 minutes. If you didn't request this verification, 
                please ignore this email.
              </p>
              
              <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 20px;">
                <p style="color: #888; font-size: 14px; margin: 0;">
                  This is an automated message from Campus Lost Found. Please do not reply to this email.
                </p>
              </div>
            </div>
          </div>
        `,
      };

      // Log the email content for demo purposes
      console.log("Email would be sent:", emailContent);

      // For production, replace this with actual email service call:
      // Example with EmailJS:
      // await emailjs.send('service_id', 'template_id', emailContent, 'public_key');

      // Example with SendGrid:
      // await sgMail.send(emailContent);

      // Example with Firebase Functions:
      // await functions.httpsCallable('sendEmail')(emailContent);

      return {
        success: true,
        message: "Verification email sent successfully",
      };
    } catch (error) {
      console.error("Error sending email:", error);
      return {
        success: false,
        message: "Failed to send verification email",
      };
    }
  }

  static generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export default EmailService;
