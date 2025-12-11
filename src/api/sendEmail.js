import { Resend } from 'resend';

export const config = {
  runtime: 'edge',
};

const API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_TO = process.env.EMAIL_TO;

if (!API_KEY) {
  // Throwing here prevents startup with a broken config in server/edge environment
  throw new Error('RESEND_API_KEY is not set');
}

const resend = new Resend(API_KEY);

// MAIN HANDLER
export default async function handler(req) {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    const body = await req.json();
    const {
      internalEmailHtml,
      customerEmailHtml,
      customerEmail,
      customerName,
    } = body || {};

    if (!customerEmail || !internalEmailHtml || !customerEmailHtml) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    // INTERNAL EMAIL (to Iliyan)
    await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject: `New Quote Request — ${customerName || 'Unknown'}`,
      html: internalEmailHtml,
    });

    // CUSTOMER CONFIRMATION EMAIL
    await resend.emails.send({
      from: EMAIL_FROM,
      to: customerEmail,
      subject: 'Your EBS Estimate Request',
      html: customerEmailHtml,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    // better error visibility in server logs
    console.error('sendEmail error:', err);
    const message = err && err.message ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}