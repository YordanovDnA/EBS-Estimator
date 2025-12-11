import { Resend } from 'resend';

export const config = {
  runtime: 'edge',
};

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req) => {
  try {
    const body = await req.json();
    const {
      internalEmailHtml,
      customerEmailHtml,
      customerEmail,
      customerName
    } = body;

    if (!customerEmail || !internalEmailHtml || !customerEmailHtml) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `New Quote Request — ${customerName}`,
      html: internalEmailHtml
    });

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: customerEmail,
      subject: "Your EBS Estimate Request",
      html: customerEmailHtml
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
