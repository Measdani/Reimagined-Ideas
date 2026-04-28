import { NextResponse } from "next/server";
import {
  buildInquiry,
  createStoredInquiry,
  validateInquiry,
} from "../../../lib/inquiry";
import {
  InquiryStorageUnavailableError,
  saveInquiry,
} from "../../../lib/inquiry-storage";
import { sendInquiryNotificationEmail } from "../../../lib/notification-email";

const fallbackContactEmail = "contact@reimaginedideas.com";

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
