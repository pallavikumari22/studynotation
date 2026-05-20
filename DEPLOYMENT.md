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
- `RAZORPAY_KEY`
- `RAZORPAY_SECRET`
- `MAIL_HOST`
- `MAIL_USER`
- `MAIL_PASS`

For a same-domain Vercel deployment, do not set `REACT_APP_BASE_URL`. The frontend will call `/api/v1`.

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
