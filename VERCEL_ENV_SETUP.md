# Vercel environment variables setup

The app needs these environment variables in Vercel for **login**, **data**, and **map** to work. If they are missing, you will see a configuration error or "Network error" on login and no data on the live site.

## Steps

1. Open [Vercel Dashboard](https://vercel.com/dashboard) → your **namaa-site** project.
2. Go to **Settings** → **Environment Variables**.
3. Add each variable below. Use **Production** (and **Preview** if you use preview deployments). Paste the **same values** you have in your local `.env` file.
4. After saving all variables, trigger a **new deployment**: Deployments → ⋮ on latest → **Redeploy**, or push a new commit.

## Variables to add

| Name | Example / where to get it |
|------|---------------------------|
| `VITE_FIREBASE_API_KEY` | Firebase Console → Project settings → General → Your apps → Web app config |
| `VITE_FIREBASE_AUTH_DOMAIN` | `namaa-fc163.firebaseapp.com` (or your project id + `.firebaseapp.com`) |
| `VITE_FIREBASE_PROJECT_ID` | `namaa-fc163` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `namaa-fc163.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | From Firebase Console (e.g. `117620777227`) |
| `VITE_FIREBASE_APP_ID` | From Firebase Console (e.g. `1:117620777227:web:...`) |
| `VITE_FIREBASE_MEASUREMENT_ID` | Optional; from Firebase Console (e.g. `G-...`) |
| `VITE_FIREBASE_DATABASE_URL` | Realtime Database URL (e.g. `https://namaa-fc163-default-rtdb.europe-west1.firebasedatabase.app/`) |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Cloud Console → APIs & Services → Credentials |
| `VITE_ADMIN_PASSWORD` | Your chosen admin password for the admin portal |

**Optional** (if you use the backend for email notifications):

| Name | Example |
|------|---------|
| `VITE_BACKEND_URL` | Your backend URL (e.g. `https://your-api.vercel.app`) |

## Quick copy from local .env

You can copy the **names** from your `.env` (every line that starts with `VITE_`) and paste the same **name** and **value** into Vercel. Do not commit `.env`; only add the values in the Vercel UI.

## After adding variables

- **Redeploy** the project so the new build includes these values.
- Test login and the New Solar Application form (map and data) on the live URL.
