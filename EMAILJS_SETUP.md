# EmailJS Setup Instructions

To enable email verification that goes to main inbox instead of spam, follow these steps:

## 1. Create EmailJS Account

1. Go to https://www.emailjs.com/
2. Sign up for a free account
3. Verify your email address

## 2. Set up Email Service

1. Go to Email Services
2. Add a new service (Gmail, Outlook, etc.)
3. Follow the setup instructions for your email provider
4. Note down the Service ID (e.g., 'service_campuslf')

## 3. Create Email Template

1. Go to Email Templates
2. Create a new template with ID: 'template_verify'
3. Use this template content:

**Subject:** Campus Lost Found - Email Verification Code

**Content:**

```
Hello {{to_name}},

Welcome to Campus Lost Found!

Your email verification code is: {{verification_code}}

Please enter this code in the signup form to complete your registration for {{university_name}}.

This code will expire in 10 minutes.

Best regards,
Campus Lost Found Team
```

## 4. Get Public Key

1. Go to Account > API Keys
2. Copy your Public Key
3. Update the EMAILJS_PUBLIC_KEY in the code

## 5. Update Configuration

Update these values in `/src/services/emailVerificationService.js`:

- EMAILJS_SERVICE_ID: Your service ID
- EMAILJS_TEMPLATE_ID: 'template_verify'
- EMAILJS_PUBLIC_KEY: Your public key

## 6. Template Variables

Make sure your template uses these variables:

- {{to_email}} - Recipient email
- {{to_name}} - Recipient name
- {{verification_code}} - 6-digit code
- {{university_name}} - University name
- {{from_name}} - 'Campus Lost Found'

## Benefits of EmailJS over Firebase Auth Emails:

- Professional sender name
- Custom branding
- Less likely to go to spam
- Better deliverability
- Custom email templates
- Analytics and tracking
