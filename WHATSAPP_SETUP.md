# WhatsApp Message Report Setup Guide

## 📋 Overview
This guide helps you set up WhatsApp message report generation and sending functionality for the Payment Tracker App.

## ✅ Features

- **PDF Generation**: Download professional reports as PDF
- **WhatsApp Integration**: Send reports via WhatsApp to any phone number
- **Dual API Support**: WhatsApp Business API + Twilio Fallback
- **Error Handling**: Comprehensive error messages and validation
- **Mobile Responsive**: Works on all devices

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install html2canvas jspdf formidable axios twilio
```

### 2. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# WhatsApp Business API (Primary)
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
WHATSAPP_ACCESS_TOKEN=your_access_token

# OR Twilio WhatsApp (Fallback)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
```

### 3. Import Components

```typescript
import WhatsAppMessageReport from '@/components/WhatsAppMessageReport';

export default function ReportPage() {
  return <WhatsAppMessageReport />;
}
```

## 🔧 Configuration

### Option A: WhatsApp Business API (Recommended)

1. **Get Credentials**:
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a business app
   - Set up WhatsApp integration
   - Generate access token

2. **Set Environment Variables**:
```env
WHATSAPP_PHONE_NUMBER_ID=123456789
WHATSAPP_BUSINESS_ACCOUNT_ID=987654321
WHATSAPP_ACCESS_TOKEN=your_token_here
```

### Option B: Twilio WhatsApp

1. **Get Credentials**:
   - Sign up at [Twilio](https://www.twilio.com/)
   - Enable WhatsApp integration
   - Get your phone number and auth tokens

2. **Set Environment Variables**:
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
```

## 📱 Usage

### Download PDF Report

```typescript
// Click "Download PDF Report" button
// Automatically generates and downloads PDF with date stamp
```

**Features**:
- Captures all report data
- Multi-page support
- Professional formatting
- Auto-named with date

### Send via WhatsApp

```typescript
// Click "Send via WhatsApp" button
// Enter phone number (format: +1234567890)
// Report sent as message with PDF
```

**Features**:
- Phone number validation
- International format support
- Real-time status updates
- Error notifications
- Success confirmation

## 📞 Phone Number Format

Accepted formats:
- `+1234567890` (International)
- `1234567890` (US)
- `+1 (234) 567-8900` (With formatting)
- `+44 20 7946 0958` (International)

The system will automatically validate and format your number.

## 🔐 Security Best Practices

1. **Never commit `.env.local`**:
```bash
echo ".env.local" >> .gitignore
```

2. **Use Environment Secrets** in Production:
   - Vercel: Settings → Environment Variables
   - Netlify: Settings → Build & Deploy
   - AWS: Secrets Manager

3. **Validate Phone Numbers**:
```typescript
const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
if (!phoneRegex.test(phoneNumber)) {
  // Show error
}
```

4. **Rate Limiting**:
```typescript
// Implement rate limiting to prevent abuse
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5 // 5 requests per 15 minutes
});
```

## 🐛 Troubleshooting

### PDF Download Not Working

**Problem**: PDF download fails
**Solution**:
```bash
npm install --save-dev @types/html2canvas @types/jspdf
```

### WhatsApp Send Fails

**Problem**: "WhatsApp service credentials not configured"
**Solution**:
- Verify `.env.local` exists
- Check all required variables are set
- Restart development server: `npm run dev`

### Invalid Phone Number

**Problem**: "Please enter a valid phone number"
**Solution**:
- Include country code: `+1234567890`
- Use 10+ digits for validation
- Try: `+1 (555) 123-4567`

### API Timeout

**Problem**: Request times out
**Solution**:
- Check internet connection
- Verify API credentials
- Check WhatsApp service status
- Increase timeout in API route

## 📊 API Response Examples

### Success Response

```json
{
  "success": true,
  "message": "Report successfully sent to +1234567890",
  "messageId": "wamid.HBEUGVlQ..."
}
```

### Error Response

```json
{
  "success": false,
  "message": "Failed to send report via WhatsApp",
  "error": "Invalid phone number format"
}
```

## 📈 Monitoring

### Track Message Status

```typescript
// Use messageId to track delivery status
const messageId = response.data.messageId;

// Check delivery status via WhatsApp Business API
const status = await checkMessageStatus(messageId);
```

### Log Analytics

```typescript
// Log report generations for analytics
console.log({
  timestamp: new Date(),
  action: 'pdf_downloaded',
  method: 'pdf',
});

console.log({
  timestamp: new Date(),
  action: 'report_sent',
  method: 'whatsapp',
  phoneNumber: formatPhoneNumber(phoneNumber),
});
```

## 🎨 Customization

### Change Report Design

Edit `WhatsAppMessageReport.tsx`:
```typescript
// Modify colors
const colors = {
  primary: '#3B82F6', // Blue
  success: '#10B981', // Green
  warning: '#F59E0B', // Orange
  danger: '#EF4444',  // Red
};
```

### Customize Message Text

```typescript
const messageText = `
Here is your WhatsApp Message Report
Generated: ${new Date().toLocaleString()}
Total Messages: ${stats.totalMessages}
Success Rate: ${stats.successRate}%
`;
```

## 📚 File Structure

```
Payment-Tracker-App/
├── src/
│   └── components/
│       ├── WhatsAppMessageReport.tsx    # Main component
│       └── DashboardLayout.tsx          # Dashboard
���── pages/
│   └── api/
│       └── send-whatsapp-report.ts      # API endpoint
├── .env.local                           # Environment config
└── package.json
```

## 🚀 Deployment

### Vercel

1. **Set Environment Variables**:
   - Go to Settings → Environment Variables
   - Add all `WHATSAPP_*` and `TWILIO_*` variables

2. **Deploy**:
```bash
vercel deploy
```

### Local Development

```bash
npm run dev
# Visit http://localhost:3000
```

## 📞 Support

### WhatsApp Business API Support
- [Facebook Developers Docs](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [WhatsApp API Reference](https://developers.facebook.com/docs/whatsapp/cloud-api/reference)

### Twilio Support
- [Twilio WhatsApp Docs](https://www.twilio.com/docs/whatsapp)
- [Twilio Console](https://www.twilio.com/console)

## ✨ Best Practices

1. **Always validate phone numbers** before sending
2. **Implement retry logic** for failed sends
3. **Monitor API usage** to avoid rate limiting
4. **Cache reports** for frequently accessed data
5. **Use HTTPS** in production
6. **Log all transactions** for audit trails
7. **Test with test numbers** before production

## 📝 Changelog

### v1.0.0
- Initial release
- PDF download functionality
- WhatsApp send capability
- Dual API support (Business API + Twilio)
- Error handling and validation
- Mobile responsive design

## 📄 License

MIT License - See LICENSE file for details
