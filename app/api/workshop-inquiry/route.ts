import { NextResponse } from "next/server";

type InquiryPayload = {
  contactName: string;
  organizationName: string;
  email: string;
  phone: string;
  programType: string;
  studentGrades: string;
  estimatedStudents: string;
  timeline: string;
  location: string;
  message: string;
};

const fallbackContactEmail = "contact@reimaginedideas.com";

function getStringValue(source: Record<string, unknown>, key: keyof InquiryPayload) {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

function sanitizeMultiline(value: string, maxLength: number) {
  return value.replace(/\r\n/g, "\n").trim().slice(0, maxLength);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function buildInquiry(payload: Record<string, unknown>): InquiryPayload {
  return {
    contactName: sanitizeMultiline(getStringValue(payload, "contactName"), 120),
    organizationName: sanitizeMultiline(getStringValue(payload, "organizationName"), 160),
    email: sanitizeMultiline(getStringValue(payload, "email"), 160),
    phone: sanitizeMultiline(getStringValue(payload, "phone"), 40),
    programType: sanitizeMultiline(getStringValue(payload, "programType"), 120),
    studentGrades: sanitizeMultiline(getStringValue(payload, "studentGrades"), 120),
    estimatedStudents: sanitizeMultiline(getStringValue(payload, "estimatedStudents"), 20),
    timeline: sanitizeMultiline(getStringValue(payload, "timeline"), 160),
    location: sanitizeMultiline(getStringValue(payload, "location"), 160),
    message: sanitizeMultiline(getStringValue(payload, "message"), 2000),
  };
}

function validateInquiry(inquiry: InquiryPayload) {
  const requiredFields: Array<keyof InquiryPayload> = [
    "contactName",
    "organizationName",
    "email",
    "programType",
    "studentGrades",
    "estimatedStudents",
    "timeline",
    "location",
    "message",
  ];

  const missingField = requiredFields.find((field) => !inquiry[field]);

  if (missingField) {
    return "Please complete all required fields before submitting.";
  }

  if (!isValidEmail(inquiry.email)) {
    return "Please enter a valid email address.";
  }

  if (!/^\d+$/.test(inquiry.estimatedStudents) || Number(inquiry.estimatedStudents) < 1) {
    return "Estimated students must be a valid number.";
  }

  if (inquiry.message.length < 20) {
    return "Please share a few more details so we can prepare an accurate quote.";
  }

  return null;
}

function buildTextEmail(inquiry: InquiryPayload) {
  return [
    "New Reimagined Ideas workshop inquiry",
    "",
    `Name: ${inquiry.contactName}`,
    `Organization: ${inquiry.organizationName}`,
    `Email: ${inquiry.email}`,
    `Phone: ${inquiry.phone || "Not provided"}`,
    `Program type: ${inquiry.programType}`,
    `Student grades: ${inquiry.studentGrades}`,
    `Estimated students: ${inquiry.estimatedStudents}`,
    `Location: ${inquiry.location}`,
    `Timeline: ${inquiry.timeline}`,
    "",
    "Program details:",
    inquiry.message,
  ].join("\n");
}

function buildHtmlEmail(inquiry: InquiryPayload) {
  const rows = [
    ["Name", inquiry.contactName],
    ["Organization", inquiry.organizationName],
    ["Email", inquiry.email],
    ["Phone", inquiry.phone || "Not provided"],
    ["Program type", inquiry.programType],
    ["Student grades", inquiry.studentGrades],
    ["Estimated students", inquiry.estimatedStudents],
    ["Location", inquiry.location],
    ["Timeline", inquiry.timeline],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;font-weight:700;color:#24324a;border-bottom:1px solid #e6ebf2;">${escapeHtml(
          label,
        )}</td><td style="padding:8px 12px;color:#5d6b82;border-bottom:1px solid #e6ebf2;">${escapeHtml(
          value,
        )}</td></tr>`,
    )
    .join("");

  return `
    <div style="font-family:Aptos,Segoe UI,sans-serif;background:#f7f9fc;padding:32px;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:24px;padding:32px;border:1px solid #e6ebf2;">
        <p style="margin:0 0 12px;color:#2e5f96;font-size:12px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;">
          Reimagined Ideas
        </p>
        <h1 style="margin:0 0 12px;color:#24324a;font-size:28px;line-height:1.1;">
          New workshop inquiry
        </h1>
        <p style="margin:0 0 24px;color:#5d6b82;font-size:16px;line-height:1.6;">
          A new quote request was submitted through the website.
        </p>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e6ebf2;border-radius:16px;overflow:hidden;">
          ${rows}
        </table>
        <div style="margin-top:24px;padding:20px;border-radius:18px;background:#fffaf2;border:1px solid #f1e5c9;">
          <p style="margin:0 0 10px;color:#24324a;font-size:14px;font-weight:700;">Program details</p>
          <p style="margin:0;color:#5d6b82;font-size:15px;line-height:1.7;white-space:pre-line;">${escapeHtml(
            inquiry.message,
          )}</p>
        </div>
      </div>
    </div>
  `;
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      {
        error: "We could not read that request. Please try again.",
      },
      { status: 400 },
    );
  }

  const inquiry = buildInquiry(payload);
  const validationError = validateInquiry(inquiry);

  if (validationError) {
    return NextResponse.json(
      {
        error: validationError,
      },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const notificationEmail =
    process.env.CONTACT_NOTIFICATION_EMAIL ?? fallbackContactEmail;
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL ?? "Reimagined Ideas <onboarding@resend.dev>";

  if (!apiKey) {
    return NextResponse.json(
      {
        error: `This form is not fully configured yet. Please email ${fallbackContactEmail} directly for now.`,
      },
      { status: 503 },
    );
  }

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [notificationEmail],
      reply_to: inquiry.email,
      subject: `Workshop inquiry from ${inquiry.contactName}`,
      text: buildTextEmail(inquiry),
      html: buildHtmlEmail(inquiry),
    }),
  });

  if (!resendResponse.ok) {
    const resendError = await resendResponse.text();

    console.error("Workshop inquiry email failed", resendError);

    return NextResponse.json(
      {
        error: `We could not send your request right now. Please try again or email ${fallbackContactEmail}.`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    message:
      "Thanks for reaching out. Your workshop request was sent, and we will follow up soon.",
  });
}
