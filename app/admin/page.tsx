import type { Metadata } from "next";
import {
  isAdminAuthenticated,
  isAdminConfigured,
} from "../../lib/admin-auth";
import {
  type InquiryStorageMode,
  getInquiryStorageMode,
  listInquiries,
} from "../../lib/inquiry-storage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Reimagined Ideas",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const adminErrorMessages: Record<string, string> = {
  config: "Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET before signing in to the admin inbox.",
  invalid: "That password did not match. Please try again.",
};

function getStorageLabel(storageMode: InquiryStorageMode) {
  if (storageMode === "blob") {
    return "Blob inbox storage is live";
  }

  if (storageMode === "file") {
    return "Local development storage is active";
  }

  return "Inbox storage still needs setup";
}

function formatSubmittedAt(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function toPhoneHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : null;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const errorMessage = params.error ? adminErrorMessages[params.error] : null;
  const storageMode = getInquiryStorageMode();
  const adminConfigured = isAdminConfigured();
  const authenticated = adminConfigured ? await isAdminAuthenticated() : false;
  const inquiries = authenticated ? await listInquiries(50) : [];
  const emailNotificationsEnabled = Boolean(process.env.RESEND_API_KEY);

  return (
    <main className="admin-shell">
      <section className="admin-panel">
        <div className="admin-header">
          <div>
            <p className="section-kicker">Reimagined Ideas admin</p>
            <h1>Quote inbox</h1>
            <p>
              Review every website quote request in one place, then reply directly to
              the families, camps, and school partners who reached out.
            </p>
          </div>

          {authenticated ? (
            <form action="/api/admin/logout" method="post">
              <button className="button button-secondary" type="submit">
                Log out
              </button>
            </form>
          ) : null}
        </div>

        <div className="admin-badges" aria-label="Admin status">
          <span>{getStorageLabel(storageMode)}</span>
          <span>
            {emailNotificationsEnabled
              ? "Email notifications are enabled"
              : "Email notifications are optional"}
          </span>
          {authenticated ? (
            <span>
              {inquiries.length} saved {inquiries.length === 1 ? "quote" : "quotes"}
            </span>
          ) : null}
        </div>

        {!adminConfigured ? (
          <div className="admin-callout admin-callout-error">
            <p>
              Before using the inbox, add <code>ADMIN_PASSWORD</code> and{" "}
              <code>ADMIN_SESSION_SECRET</code> in your environment variables.
            </p>
          </div>
        ) : null}

        {storageMode === "unconfigured" ? (
          <div className="admin-callout">
            <p>
              Add <code>BLOB_READ_WRITE_TOKEN</code> to save incoming quote requests in
              this inbox after deployment. Until that is set, the website can still use
              email notifications, but new quotes will not be stored here.
            </p>
          </div>
        ) : null}

        {errorMessage ? (
          <p className="form-status form-status-error" role="status">
            {errorMessage}
          </p>
        ) : null}

        {!authenticated && adminConfigured ? (
          <form action="/api/admin/login" className="admin-login-form" method="post">
            <label>
              <span>Admin password</span>
              <input
                name="password"
                placeholder="Enter your admin password"
                required
                type="password"
              />
            </label>

            <p className="admin-helper-text">
              This page is protected with an HttpOnly session cookie after sign-in.
            </p>

            <button className="button button-primary" type="submit">
              Sign in
            </button>
          </form>
        ) : null}

        {authenticated ? (
          inquiries.length > 0 ? (
            <div className="admin-inquiry-grid">
              {inquiries.map((inquiry) => {
                const phoneHref = inquiry.phone ? toPhoneHref(inquiry.phone) : null;
                const mailtoHref = `mailto:${inquiry.email}?subject=${encodeURIComponent(
                  `Reimagined Ideas workshop inquiry`,
                )}`;

                return (
                  <article className="admin-inquiry-card" key={inquiry.id}>
                    <div className="admin-inquiry-head">
                      <div>
                        <p className="admin-inquiry-date">
                          Submitted {formatSubmittedAt(inquiry.submittedAt)}
                        </p>
                        <h2>{inquiry.organizationName}</h2>
                        <p className="admin-inquiry-contact">{inquiry.contactName}</p>
                      </div>
                      <span className="admin-stamp">{inquiry.programType}</span>
                    </div>

                    <div className="admin-contact-links">
                      <a href={mailtoHref}>{inquiry.email}</a>
                      {phoneHref ? <a href={phoneHref}>{inquiry.phone}</a> : null}
                    </div>

                    <dl className="admin-meta">
                      <div className="admin-meta-block">
                        <dt>Students</dt>
                        <dd>{inquiry.estimatedStudents}</dd>
                      </div>
                      <div className="admin-meta-block">
                        <dt>Grades</dt>
                        <dd>{inquiry.studentGrades}</dd>
                      </div>
                      <div className="admin-meta-block">
                        <dt>Location</dt>
                        <dd>{inquiry.location}</dd>
                      </div>
                      <div className="admin-meta-block">
                        <dt>Timeline</dt>
                        <dd>{inquiry.timeline}</dd>
                      </div>
                    </dl>

                    <div className="admin-message">
                      <p className="admin-message-label">Program details</p>
                      <p>{inquiry.message}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="admin-empty">
              <h2>No saved quotes yet</h2>
              <p>
                When someone submits the website form, their request will appear here
                automatically.
              </p>
            </div>
          )
        ) : null}
      </section>
    </main>
  );
}
