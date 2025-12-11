import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const {
      internalEmailHtml,
      customerEmailHtml,
      customerEmail,
      customerName,
    } = req.body;

    if (!customerEmail || !internalEmailHtml || !customerEmailHtml) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // INTERNAL EMAIL
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `New Quote Request — ${customerName}`,
      html: internalEmailHtml,
    });

    // CUSTOMER EMAIL
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: customerEmail,
      subject: "Your EBS Estimate Request",
      html: customerEmailHtml,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("EMAIL ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
