# Partnership Email Template Setup for EmailJS

## Template ID: `template_partnership`

### Email Configuration

**To Email:** campuslostfound@gmail.com
**Subject:** Partnership Request - {{university_name}}
**From Name:** {{from_name}}
**Reply To:** {{from_email}}

### Email Template HTML:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Partnership Request</title>
    <style>
      body {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background: linear-gradient(45deg, #3b74d5, #5dc173);
        color: white;
        padding: 20px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      }
      .content {
        background: #f9fafb;
        padding: 30px;
        border: 1px solid #e5e7eb;
      }
      .info-section {
        background: white;
        padding: 20px;
        margin: 15px 0;
        border-radius: 8px;
        border-left: 4px solid #3b74d5;
      }
      .label {
        font-weight: bold;
        color: #374151;
        display: inline-block;
        width: 120px;
      }
      .footer {
        background: #374151;
        color: white;
        padding: 20px;
        text-align: center;
        border-radius: 0 0 8px 8px;
        font-size: 14px;
      }
      .priority-high {
        background: #fee2e2;
        border-left-color: #dc2626;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>🤝 New Partnership Request</h1>
      <p>University Partnership Inquiry</p>
    </div>

    <div class="content">
      <div class="info-section">
        <h3>University Information</h3>
        <p><span class="label">University:</span> {{university_name}}</p>
        <p><span class="label">Contact Person:</span> {{contact_person}}</p>
        <p><span class="label">Position:</span> {{position}}</p>
      </div>

      <div class="info-section">
        <h3>Contact Details</h3>
        <p>
          <span class="label">Email:</span>
          <a href="mailto:{{from_email}}">{{from_email}}</a>
        </p>
        <p><span class="label">Phone:</span> {{phone}}</p>
      </div>

      <div class="info-section">
        <h3>Partnership Details</h3>
        <p><strong>Message:</strong></p>
        <div
          style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin-top: 10px;"
        >
          {{message}}
        </div>
      </div>

      <div class="info-section">
        <h3>Next Steps</h3>
        <ul>
          <li>Review partnership requirements</li>
          <li>Schedule initial consultation call</li>
          <li>Prepare partnership proposal</li>
          <li>Follow up within 24 hours</li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <p><strong>Campus Lost Found</strong> - Partnership Team</p>
      <p>📧 campuslostfound@gmail.com | 📱 +92 3224121825</p>
      <p style="font-size: 12px; opacity: 0.8;">
        This email was sent from the Campus Lost Found partnership request form.
      </p>
    </div>
  </body>
</html>
```

### Variables Used in Template:

- `{{university_name}}` - Name of the university
- `{{contact_person}}` - Name of the contact person
- `{{position}}` - Position/title of the contact person
- `{{from_email}}` - Email address of the requester
- `{{phone}}` - Phone number (with fallback text)
- `{{message}}` - Partnership details message

### Setup Instructions:

1. **Log into EmailJS Dashboard:** https://www.emailjs.com/
2. **Go to Email Templates**
3. **Create New Template**
4. **Set Template ID:** `template_partnership`
5. **Copy the HTML above** into the content area
6. **Configure the variables** as listed above
7. **Set the email service** to send to `campuslostfound@gmail.com`
8. **Test the template** with sample data

### Auto-Reply Template (Optional):

You can also create an auto-reply template to confirm receipt:

**Template ID:** `template_partnership_confirmation`
**To:** {{from_email}}
**Subject:** Partnership Request Received - {{university_name}}

```html
<div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
  <h2 style="color: #3B74D5;">Partnership Request Received</h2>
  <p>Dear {{contact_person}},</p>
  <p>
    Thank you for your interest in partnering with
    <strong>Campus Lost Found</strong>!
  </p>
  <p>
    We have received your partnership request for
    <strong>{{university_name}}</strong> and will review it carefully.
  </p>
  <p><strong>What happens next:</strong></p>
  <ul>
    <li>Our partnership team will review your request within 24 hours</li>
    <li>We'll schedule a consultation call to discuss your needs</li>
    <li>We'll prepare a customized partnership proposal</li>
  </ul>
  <p>Best regards,<br />Campus Lost Found Partnership Team</p>
</div>
```

### Service Configuration:

Make sure your EmailJS service is configured with:

- **Service ID:** `service_campuslf`
- **Template ID:** `template_partnership`
- **Public Key:** Your EmailJS public key

Update these values in `src/services/partnershipService.js` if they differ from your current setup.
