import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import axios from 'axios';

interface ResponseData {
  success: boolean;
  message: string;
  messageId?: string;
  error?: string;
}

// Disable default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Format phone number to international format
const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // If it doesn't start with country code, assume it's US (+1)
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }

  return `+${cleaned}`;
};

// Send WhatsApp message using Twilio or similar service
const sendWhatsAppMessage = async (
  phoneNumber: string,
  message: string,
  fileBuffer?: Buffer,
  fileName?: string
): Promise<{ messageId: string }> => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = process.env.TWILIO_WHATSAPP_NUMBER;

  if (!accountSid || !authToken || !twilioPhoneNumber) {
    throw new Error(
      'WhatsApp service credentials not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_NUMBER environment variables.'
    );
  }

  const client = require('twilio')(accountSid, authToken);

  try {
    // Format the phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);

    // Create the message content
    const messageContent: any = {
      from: `whatsapp:${twilioPhoneNumber}`,
      to: `whatsapp:${formattedPhone}`,
      body: message,
    };

    // If file buffer is provided, upload to Twilio and attach
    if (fileBuffer && fileName) {
      // Create temporary file
      const tempFilePath = `/tmp/${fileName}`;
      fs.writeFileSync(tempFilePath, fileBuffer);

      // For Twilio, we would need to host the file on a public URL
      // For now, we'll just send the message text
      // In production, implement proper file hosting (e.g., AWS S3)

      fs.unlinkSync(tempFilePath);
    }

    // Send the message
    const sentMessage = await client.messages.create(messageContent);

    return {
      messageId: sentMessage.sid,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to send WhatsApp message: ${errorMessage}`);
  }
};

// Alternative: Send using WhatsApp Business API
const sendWhatsAppViaBusinessAPI = async (
  phoneNumber: string,
  message: string
): Promise<{ messageId: string }> => {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const businessAccountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    throw new Error(
      'WhatsApp Business API credentials not configured. Please set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN environment variables.'
    );
  }

  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);

    const response = await axios.post(
      `https://graph.instagram.com/v17.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formattedPhone,
        type: 'text',
        text: {
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      messageId: response.data.messages[0].id,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to send WhatsApp message: ${errorMessage}`);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
      error: 'Only POST requests are allowed',
    });
  }

  try {
    // Parse form data
    const form = formidable({ multiples: false });
    const [fields, files] = await form.parse(req);

    // Extract form fields
    const phoneNumber = Array.isArray(fields.phoneNumber)
      ? fields.phoneNumber[0]
      : fields.phoneNumber || '';

    const messageText = Array.isArray(fields.message)
      ? fields.message[0]
      : fields.message || 'Here is your WhatsApp Message Report';

    // Validate phone number
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required',
        error: 'Please provide a valid phone number',
      });
    }

    // Extract file if present
    let fileBuffer: Buffer | undefined;
    let fileName: string | undefined;

    if (files.file) {
      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      fileBuffer = fs.readFileSync(file.filepath);
      fileName = file.originalFilename || 'report.pdf';
    }

    // Attempt to send via WhatsApp
    let result;
    try {
      // Try WhatsApp Business API first
      result = await sendWhatsAppViaBusinessAPI(phoneNumber, messageText);
    } catch (businessApiError) {
      console.log('Business API failed, trying Twilio...');
      // Fall back to Twilio
      result = await sendWhatsAppMessage(phoneNumber, messageText, fileBuffer, fileName);
    }

    return res.status(200).json({
      success: true,
      message: `Report successfully sent to ${phoneNumber}`,
      messageId: result.messageId,
    });
  } catch (error) {
    console.error('WhatsApp API Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return res.status(500).json({
      success: false,
      message: 'Failed to send report via WhatsApp',
      error: errorMessage,
    });
  }
}
