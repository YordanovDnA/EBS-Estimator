// /api/sendEmail.js

import { Resend } from "resend";

export const config = {
  runtime: "nodejs",
};

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res
        .status(200)
        .json({ ok: true, message: "sendEmail API is alive (use POST)" });
    }

    const body = req.body || {};
    const internalEmailHtml = String(body.internalEmailHtml || "").trim();
    const customerEmailHtml = String(body.customerEmailHtml || "").trim();
    const customerEmail = String(body.customerEmail || "").trim();
    const customerName = String(body.customerName || "Customer").trim();

    if (!internalEmailHtml || !customerEmailHtml || !customerEmail) {
      return res.status(400).json({
        error:
          "Missing fields: internalEmailHtml, customerEmailHtml, customerEmail are required",
      });
    }

    // Basic email sanity check (simple + good enough for forms)
    if (!/^\S+@\S+\.\S+$/.test(customerEmail)) {
      return res.status(400).json({ error: "Invalid customerEmail" });
    }

    const from =
      process.env.EMAIL_FROM ||
      "Exceptional Building <no-reply@ebs-team.co.uk>";
    const toInternal =
      process.env.EMAIL_TO || "your.personal.email@example.com";

    // 1) INTERNAL EMAIL (to you)
    await resend.emails.send({
      from,
      to: toInternal,
      subject: `New Quote Request — ${customerName}`,
      html: internalEmailHtml,
      replyTo: customerEmail, // so you can hit "Reply" and it goes to customer
    });

    // 2) CUSTOMER CONFIRMATION EMAIL
    await resend.emails.send({
      from,
      to: customerEmail,
      subject: "Your EBS Estimate Summary",
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
