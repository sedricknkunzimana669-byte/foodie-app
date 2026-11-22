# Portfolio backend

## Setup

1. Create the database named by `DB_NAME` and run `schema.sql` in it.
2. Set `PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `CLIENT_ORIGIN` in `backend/.env`. Use `.env.example` as a template.
3. Configure `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and `JWT_SECRET`. Generate a password hash with `node -e "console.log(require('bcryptjs').hashSync('your-strong-password', 12))"` and a secret with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Never commit these values.
4. From this directory, run `npm install` and then `npm run dev`.
5. In the project root, copy `.env.example` to `.env`, then run `npm run dev`.

Open `/admin` to sign in. The portfolio loads editable profile, education, skills, projects, and services from the API; the admin can also review and delete contact messages. All admin writes and message reads require the HttpOnly admin session cookie.

Profile and project images can be uploaded from the admin forms (JPG, PNG, WEBP, or GIF, up to 5 MB). Uploaded files are served publicly for the portfolio and stored in `backend/uploads`; keep that directory on persistent storage when deploying.

The browser API base URL can be changed with `VITE_API_URL`.
