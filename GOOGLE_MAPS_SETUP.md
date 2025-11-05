# Google Maps Integration Setup Guide

The application form now includes an interactive Google Maps location picker that allows users to pin their exact location on a map.

## Features
- ✅ Interactive map with click-to-pin functionality
- ✅ Default location set to Doha, Qatar
- ✅ Visual marker with green pin
- ✅ Displays selected coordinates
- ✅ Saves latitude and longitude with application
- ✅ Graceful fallback if API key not configured

## Setup Instructions

### Step 1: Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **API Key**
5. Copy your new API key

### Step 2: Enable Required APIs

In the Google Cloud Console:

1. Go to **APIs & Services** > **Library**
2. Search for and enable the following APIs:
   - **Maps JavaScript API**
   - **Places API** (optional, for future address search)

### Step 3: Restrict Your API Key (Recommended)

For security, restrict your API key:

1. In **Credentials**, click on your API key
2. Under **Application restrictions**:
   - Select **HTTP referrers (web sites)**
   - Add your domains:
     - `http://localhost:5173/*` (for development)
     - `https://your-production-domain.com/*`
3. Under **API restrictions**:
   - Select **Restrict key**
   - Choose: Maps JavaScript API, Places API

### Step 4: Add to Environment Variables

1. Open your `.env` file (or create it from `env-template.txt`)
2. Add your API key:

```env
VITE_GOOGLE_MAPS_API_KEY=your-actual-api-key-here
```

### Step 5: Restart Development Server

```bash
npm run dev
```

## Usage

### For Users
1. Navigate to the Application Form
2. Scroll to the "Pin Your Location on Map" section
3. Click anywhere on the map to set your location
4. The marker will move to the clicked position
5. Coordinates are automatically saved with your application

### For Developers

The `MapPicker` component is located at `src/components/ui/MapPicker.jsx` and accepts:

```jsx
<MapPicker
  value={{ lat: 25.2854, lng: 51.5310 }}
  onChange={(coords) => console.log(coords)}
  apiKey="your-api-key"
/>
```

**Props:**
- `value`: Object with `lat` and `lng` properties (optional)
- `onChange`: Callback function receiving `{ lat, lng }` object
- `apiKey`: Your Google Maps API key

## Stored Data

When a user submits an application, the following location data is saved:

```javascript
{
  location: "25.285400, 51.531000",  // String format for display
  coordinates: {                      // Object for precise location
    lat: 25.2854,
    lng: 51.5310
  }
}
```

## Troubleshooting

### Map not showing?
- Check that `VITE_GOOGLE_MAPS_API_KEY` is set in your `.env` file
- Verify the Maps JavaScript API is enabled in Google Cloud Console
- Check browser console for errors
- Restart your development server after adding the API key

### "Map feature not configured" message?
- The API key is missing or not loaded
- Add the key to `.env` and restart the server

### API Key errors?
- Verify your API key is correct
- Check that HTTP referrer restrictions allow your domain
- Ensure billing is enabled in Google Cloud Console (required for Maps API)

## Cost Considerations

Google Maps API uses a pay-as-you-go pricing model:
- Free tier: $200 credit per month
- Dynamic Maps: $7 per 1,000 loads
- Most small to medium sites stay within the free tier

Monitor usage in the [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/quotas).

## Future Enhancements

Potential improvements for the map picker:
- [ ] Address search/autocomplete
- [ ] Geolocation (auto-detect user's location)
- [ ] Multiple markers for multiple locations
- [ ] Polygon drawing for project area
- [ ] Satellite view toggle
- [ ] Distance/area measurement tools

---

**Need Help?** Check the [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)


