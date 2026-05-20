# StudyNotion Production Deployment

## Vercel frontend + backend

This project is configured to deploy the React frontend and Express API in one Vercel project.

Vercel settings:

- Framework Preset: Create React App
- Install Command: `npm install && cd Server && npm install`
- Build Command: `npm run build`
- Output Directory: `build`

Required Vercel environment variables:

- `MONGODB_URL`
- `CLIENT_URL`
- `JWT_SECRET`
- `FOLDER_NAME`
- `CLOUD_NAME`
- `API_KEY`
- `API_SECRET`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

Optional environment variables:

- `RAZORPAY_KEY`
- `RAZORPAY_SECRET`
- `MAIL_HOST`
- `MAIL_PORT`
- `MAIL_USER`
- `MAIL_PASS`

For a same-domain Vercel deployment, do not set `REACT_APP_BASE_URL`. The frontend will call `/api/v1`.

`OPENAI_API_KEY` enables the AI Tutor page. If it is not set, the page still works with local course recommendations and study-plan fallback text.
Razorpay checkout and outbound emails are disabled gracefully when their variables are not configured.

After deploying:

1. Open `/api/health` on your Vercel domain.
2. Confirm it returns `StudyNotion API is healthy`.
3. Set `CLIENT_URL` to your deployed Vercel URL.
4. Redeploy after changing environment variables.

Local development:

1. Copy `.env.example` to `.env`.
2. Copy `Server/.env.example` to `Server/.env`.
3. Run `npm install`.
4. Run `cd Server && npm install`.
5. Run `npm run dev`.

Seed starter data:

1. Put your MongoDB Atlas connection string in `Server/.env` as `MONGODB_URL`.
2. Run `cd Server && npm run seed`.
3. Login with one of the demo accounts:
   - Admin: `admin@studynotion.com` / `Password@123`
   - Instructor: `instructor@studynotion.com` / `Password@123`
   - Student: `student@studynotion.com` / `Password@123`
