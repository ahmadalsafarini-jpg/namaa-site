# Google Maps setup (fix AuthFailure)

The map uses **Maps JavaScript API** and **Places API**. If you see "Error: AuthFailure", fix the API key in Google Cloud:

## 1. Enable APIs

1. Open [Google Cloud Console](https://console.cloud.google.com/) and select your project.
2. Go to **APIs & Services** → **Library**.
3. Enable:
   - **Maps JavaScript API**
   - **Places API**

## 2. Use a browser key

- In **APIs & Services** → **Credentials**, use a **browser / web** key (e.g. "Namaa-web" or "New Browser key").
- Do **not** use a key restricted only to "Generative Language API" or other non-Maps APIs.

## 3. Key restrictions (optional but recommended)

- **Application restrictions:** If set to "HTTP referrers", add:
  - `http://localhost:*`
  - `https://www.namaaenergy.com/*`
  - `https://namaaenergy.com/*`
- **API restrictions:** Either "Don't restrict key" or restrict to:
  - Maps JavaScript API
  - Places API

## 4. Billing

- Google Maps requires a **billing account** linked to the project (free tier is available).
- In Cloud Console: **Billing** → link a billing account to the project.

## 5. Local env and restart

- Put the key in `.env`: `VITE_GOOGLE_MAPS_API_KEY=your-key`
- Restart the dev server: stop it, then `npm run dev`.

The map is configured to use **raster** mode (no Map ID needed), so once the key is valid and the APIs are enabled, it should load.
