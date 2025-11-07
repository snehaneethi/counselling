# EmailJS Setup Guide

This guide will help you set up email functionality for the Snehaneethi Counselling website.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (free tier includes 200 emails/month)
3. Verify your email address

## Step 2: Add Email Service

1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the connection steps
5. Note your **Service ID** (e.g., `service_xxxxx`)

## Step 3: Create Email Templates

### Contact Form Template

1. Go to **Email Templates** → **Create New Template**
2. Name it: "Contact Form"
3. Use this template:

```
Subject: New Contact Message from {{from_name}}

From: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}

Message:
{{message}}

---
This message was sent from the Snehaneethi Counselling website.
```

4. Note your **Template ID** (e.g., `template_xxxxx`)

### Booking Form Template

1. Create another template: "Booking Request"
2. Use this template:

```
Subject: New Booking Request - {{service}}

Client Details:
Name: {{client_name}}
Email: {{client_email}}
Phone: {{client_phone}}

Booking Details:
Service: {{service}}
Date: {{date}}
Time: {{time}}

Additional Message:
{{message}}

---
This booking was submitted from the Snehaneethi Counselling website.
```

3. Note your **Template ID**

## Step 4: Get Your Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** (e.g., `xxxxxxxxxxxxx`)

## Step 5: Update JavaScript File

1. Open `js/script.js`
2. Find these lines (around line 465):

```javascript
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID_CONTACT = 'YOUR_CONTACT_TEMPLATE_ID';
const EMAILJS_TEMPLATE_ID_BOOKING = 'YOUR_BOOKING_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
```

3. Replace with your actual values:

```javascript
const EMAILJS_SERVICE_ID = 'service_xxxxx';
const EMAILJS_TEMPLATE_ID_CONTACT = 'template_xxxxx';
const EMAILJS_TEMPLATE_ID_BOOKING = 'template_xxxxx';
const EMAILJS_PUBLIC_KEY = 'xxxxxxxxxxxxx';
```

## Step 6: Test

1. Submit a contact form on your website
2. Check your email inbox
3. If emails aren't arriving, check the browser console for errors

## Troubleshooting

- **Emails not sending**: Check that all IDs are correct and your EmailJS account is verified
- **Template variables not working**: Make sure variable names match exactly (case-sensitive)
- **CORS errors**: EmailJS handles CORS automatically, but ensure you're using the correct public key

## Alternative: Backend Email Service

If you prefer a backend solution, you can:
1. Create a server endpoint (Node.js, PHP, Python, etc.)
2. Replace the EmailJS functions in `script.js` with fetch calls to your API
3. Use services like SendGrid, Mailgun, or AWS SES on the backend

