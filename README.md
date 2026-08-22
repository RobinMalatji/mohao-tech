# Mohao Tech

A production-ready website for Mohao Tech: software development, Android and iOS applications, digital marketing, SEO and e-commerce.

The public site, contact form, PostgreSQL enquiry store, email notifications and a protected admin dashboard are all included.

## Stack

- Next.js (App Router) and TypeScript
- Tailwind CSS
- PostgreSQL with Prisma
- Server Actions for forms
- Session-based admin authentication
- Pluggable email providers (`console`, `smtp`, `resend`)

## Local setup

1. Install [Node.js 20+](https://nodejs.org/) and [pnpm](https://pnpm.io/).
2. Install [Docker](https://www.docker.com/) if you want a local PostgreSQL instance.
3. Copy environment variables:

```bash
cp .env.example .env
```

4. Set at least these values in `.env`:

- `DATABASE_URL`
- `AUTH_SECRET` (a long random string)
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` (12+ characters) for the first administrator
- `BUSINESS_EMAIL` for enquiry notifications
- `EMAIL_FROM`
- `EMAIL_PROVIDER` (`console` is fine for local development)

5. Start PostgreSQL:

```bash
docker compose up -d
```

6. Install dependencies, apply the schema and create the admin user:

```bash
pnpm install
pnpm db:generate
pnpm prisma migrate deploy
pnpm db:seed
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The admin area is at `/admin`.

## Email configuration

`EMAIL_PROVIDER` selects the delivery backend. The rest of the application always calls the same `sendEmail` helper, so the provider can be changed later without rewriting the contact flow.

### console

Logs mail to the server output. Use this in development.

### smtp

Set:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE` (`true` for port 465)
- `SMTP_USER`
- `SMTP_PASSWORD`

### resend

Set `RESEND_API_KEY` and a verified `EMAIL_FROM` address.

If an enquiry is saved but email delivery fails, the visitor still sees a success message and the failure is logged so the team can follow up from the admin dashboard.

## Admin

1. Seed an administrator with `pnpm db:seed`.
2. Sign in at `/admin/login`.
3. Search, filter, update status, archive or delete enquiries.

Admin routes are excluded from the sitemap and robots file. Authentication is checked in the server actions and pages. `src/proxy.ts` only performs an optimistic cookie check.

## Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm test` | Unit tests for validation, rate limiting and email |
| `pnpm lint` | ESLint |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm db:migrate` | Create/apply migrations in development |
| `pnpm prisma migrate deploy` | Apply existing migrations |
| `pnpm db:seed` | Create or update the administrator |
| `pnpm db:studio` | Browse the database |

## Production notes

- Use a managed PostgreSQL database and set `DATABASE_URL`.
- Generate a unique `AUTH_SECRET`.
- Switch `EMAIL_PROVIDER` to `smtp` or `resend`.
- Set `NEXT_PUBLIC_SITE_URL` to the public HTTPS origin.
- Run `pnpm prisma migrate deploy` and `pnpm db:seed` as part of first deploy.
- Never commit `.env` files or credentials.

## Tests

```bash
pnpm test
```

Covered areas include contact validation (empty fields, invalid email, long messages, special characters, honeypot), rate limiting, and email provider failures (invalid recipient and missing environment variables).
