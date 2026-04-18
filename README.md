# Reimagined Ideas

Reimagined Ideas is a one-page Next.js website for promoting hands-on STEM workshops for summer programs, schools, and enrichment partners.

## Run locally

```bash
npm install
npm run dev
```

## Deploy with Git and Vercel

1. Create a new Git repository and push this project.
2. Import the repository into Vercel.
3. Vercel will detect Next.js automatically and deploy the site.

## Configure workshop inquiries and admin inbox

The quote request form uses a Next.js API route. You can keep email alerts, save
submissions to the admin inbox, or use both.

```bash
RESEND_API_KEY=your_resend_api_key
CONTACT_NOTIFICATION_EMAIL=contact@reimaginedideas.com
CONTACT_FROM_EMAIL=Reimagined Ideas <onboarding@resend.dev>
ADMIN_PASSWORD=choose-a-strong-password
ADMIN_SESSION_SECRET=generate-a-long-random-secret
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

For local development, copy `.env.example` to `.env.local`.

On Vercel, add the same values in the project Environment Variables settings.

- `BLOB_READ_WRITE_TOKEN` stores quote requests for the password-protected admin
  inbox at `/admin`.
- `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` protect that admin page.
- `RESEND_API_KEY` keeps email notifications enabled so new quote requests are also
  sent to `CONTACT_NOTIFICATION_EMAIL`.

If Blob storage is configured, the website can still accept and store quote requests
even if email notifications are temporarily disabled.

## Main files

- `app/page.tsx` - landing page content
- `app/globals.css` - visual design and responsive styling
- `components/WorkshopInquiryForm.tsx` - quote request form UI
- `app/api/workshop-inquiry/route.ts` - inquiry validation, storage, and email delivery
- `app/admin/page.tsx` - password-protected admin inbox
- `lib/inquiry-storage.ts` - Blob-backed quote storage with local dev fallback
- `public/techflyer.png` - flyer reference image used on the site
