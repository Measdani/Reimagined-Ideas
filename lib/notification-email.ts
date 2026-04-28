import nodemailer, { type Transporter } from "nodemailer";
import {
  buildHtmlEmail,
  buildTextEmail,
  type InquiryPayload,
} from "./inquiry";

type EmailDeliveryResult = {
  delivered: boolean;
  configured: boolean;
};

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromEmail: string;
  notificationEmail: string;
};

let cachedTransporter: Transporter | null = null;

function getSmtpConfig(): SmtpConfig | null {
  const username = process.env.SMTP_USERNAME?.trim() ?? "";
  const password = process.env.SMTP_PASSWORD?.trim() ?? "";
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL?.trim() || `Reimagined Ideas <${username}>`;
  const notificationEmail =
    process.env.CONTACT_NOTIFICATION_EMAIL?.trim() || "contact@reimaginedideas.com";

  if (!username || !password) {
    return null;
  }

  const host = process.env.SMTP_HOST?.trim() || "smtppro.zoho.com";
  const port = Number(process.env.SMTP_PORT ?? "465");

  if (!Number.isInteger(port) || port < 1) {
    return null;
  }

  const secure =
    process.env.SMTP_SECURE?.toLowerCase() === "true" ||
    (process.env.SMTP_SECURE === undefined && port === 465);

  return {
    host,
    port,
    secure,
    username,
    password,
    fromEmail,
    notificationEmail,
  };
}

function getTransporter(config: SmtpConfig) {
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.username,
        pass: config.password,
      },
    });
  }

  return cachedTransporter;
}

export async function sendInquiryNotificationEmail(
  inquiry: InquiryPayload,
): Promise<EmailDeliveryResult> {
  const config = getSmtpConfig();

  if (!config) {
    return {
      delivered: false,
      configured: false,
    };
  }

  try {
    await getTransporter(config).sendMail({
      from: config.fromEmail,
      to: config.notificationEmail,
      replyTo: inquiry.email,
      subject: `Workshop inquiry from ${inquiry.contactName}`,
      text: buildTextEmail(inquiry),
      html: buildHtmlEmail(inquiry),
    });

    return {
      delivered: true,
      configured: true,
    };
  } catch (error) {
    console.error("Workshop inquiry email failed", error);

    return {
      delivered: false,
      configured: true,
    };
  }
}
