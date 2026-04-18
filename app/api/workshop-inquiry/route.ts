import { NextResponse } from "next/server";
import {
  buildHtmlEmail,
  buildInquiry,
  buildTextEmail,
  createStoredInquiry,
  validateInquiry,
} from "../../../lib/inquiry";
import {
  InquiryStorageUnavailableError,
  saveInquiry,
} from "../../../lib/inquiry-storage";

const fallbackContactEmail = "contact@reimaginedideas.com";

async function sendInquiryNotificationEmail(inquiry: ReturnType<typeof buildInquiry>) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return {
      delivered: false,
      configured: false,
    };
  }

  const notificationEmail =
    process.env.CONTACT_NOTIFICATION_EMAIL ?? fallbackContactEmail;
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL ?? "Reimagined Ideas <onboarding@resend.dev>";

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

    return {
      delivered: false,
      configured: true,
    };
  }

  return {
    delivered: true,
    configured: true,
  };
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

  const storedInquiry = createStoredInquiry(inquiry);
  let inquirySaved = false;
  let storageUnavailable = false;

  try {
    await saveInquiry(storedInquiry);
    inquirySaved = true;
  } catch (error) {
    if (error instanceof InquiryStorageUnavailableError) {
      storageUnavailable = true;
    } else {
      console.error("Workshop inquiry storage failed", error);
    }
  }

  const emailResult = await sendInquiryNotificationEmail(inquiry);

  if (!inquirySaved && !emailResult.delivered) {
    const errorMessage =
      !emailResult.configured && storageUnavailable
        ? `This form is not fully configured yet. Please email ${fallbackContactEmail} directly for now.`
        : `We could not send your request right now. Please try again or email ${fallbackContactEmail}.`;

    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: emailResult.configured ? 502 : 503 },
    );
  }

  return NextResponse.json({
    message:
      "Thanks for reaching out. Your workshop request was received, and we will follow up soon.",
  });
}
