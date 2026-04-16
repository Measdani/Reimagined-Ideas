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

## Configure workshop inquiries

The quote request form uses a Next.js API route and expects these environment variables:

```bash
RESEND_API_KEY=your_resend_api_key
CONTACT_NOTIFICATION_EMAIL=contact@reimaginedideas.com
CONTACT_FROM_EMAIL=Reimagined Ideas <onboarding@resend.dev>
```

For local development, copy `.env.example` to `.env.local`.

On Vercel, add the same values in the project Environment Variables settings. Once
`RESEND_API_KEY` is set, form submissions will be emailed to
`CONTACT_NOTIFICATION_EMAIL`.

## Main files

- `app/page.tsx` - landing page content
- `app/globals.css` - visual design and responsive styling
- `components/WorkshopInquiryForm.tsx` - quote request form UI
- `app/api/workshop-inquiry/route.ts` - inquiry validation and email delivery
- `public/techflyer.png` - flyer reference image used on the site
