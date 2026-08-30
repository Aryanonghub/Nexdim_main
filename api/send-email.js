// Vercel serverless function. The Resend key is read from RESEND_API_KEY with no
// VITE_ prefix on purpose: anything prefixed VITE_ is inlined into the public
// client bundle by Vite, which would publish the key to every visitor.
import { Resend } from 'resend';

function buildEmailText({ name, email, phone, message }) {
  return `New Contact Form Submission

Name: ${name}
Phone: ${phone || 'N/A'}
Email: ${email}

Message:
${message || 'N/A'}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const { name, email, phone, message } = body;

  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name and email are required.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const toEmail = process.env.RESEND_TO_EMAIL;

  if (!apiKey || !fromEmail || !toEmail) {
    console.error('send-email: missing RESEND_API_KEY / RESEND_FROM_EMAIL / RESEND_TO_EMAIL');
    return res.status(500).json({ success: false, error: 'Email is not configured on the server.' });
  }

  try {
    const resend = new Resend(apiKey);
    const response = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,                       // so replying goes to the enquirer
      subject: `New Contact Inquiry from ${name}`,
      text: buildEmailText({ name, email, phone, message }),
    });

    if (response.error) {
      console.error('send-email: resend error', response.error);
      return res.status(502).json({ success: false, error: response.error.message || 'Resend API error' });
    }
    return res.status(200).json({ success: true, id: response.data?.id });
  } catch (err) {
    console.error('send-email: unexpected error', err);
    return res.status(500).json({ success: false, error: 'Could not send the message.' });
  }
}
