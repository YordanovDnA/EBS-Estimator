// /api/sendEmail.js  (at project root)

import { Resend } from "resend";

export const config = {
  runtime: "nodejs", // force Node runtime (NOT edge)
};

// init resend with env var
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  try {
    // Only allow POST
    if (req.method !== "POST") {
      return res
        .status(200)
        .json({ ok: true, message: "sendEmail API is alive (use POST)" });
    }

    // Body should already be JSON-parsed by Vercel
    const {
      internalEmailHtml,
      customerEmailHtml,
      customerEmail,
      customerName,
    } = req.body || {};

    if (!internalEmailHtml || !customerEmailHtml || !customerEmail) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const from =
      process.env.EMAIL_FROM || "Exceptional Building <no-reply@ebs-team.co.uk>";
    const toInternal =
      process.env.EMAIL_TO || "your.personal.email@example.com";

    // INTERNAL EMAIL TO YOU
    await resend.emails.send({
      from,
      to: toInternal,
      subject: `New Quote Request — ${customerName || "Customer"}`,
      html: internalEmailHtml,
    });

    // CUSTOMER CONFIRMATION EMAIL
    await resend.emails.send({
      from,
      to: customerEmail,
      subject: "Your EBS Estimate Request",
      html: customerEmailHtml,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("sendEmail function error:", error);
    return res.status(500).json({
      error: "Email send failed",
      details: error?.message || String(error),
    });
  }
}
