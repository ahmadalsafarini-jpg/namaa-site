# 🔑 Enable Google Maps APIs - Quick Guide

Your API key has been added: `AIzaSyDm_M946_Grklz5iwGQoePg47uZJNBezRI`

## ⚠️ Important: Enable Required APIs

Your API key needs the following APIs enabled in Google Cloud Console:

### Step 1: Go to Google Cloud Console
Visit: https://console.cloud.google.com/apis/library

### Step 2: Enable These APIs

#### 1. **Maps JavaScript API** (Required) ⭐
- Search for "Maps JavaScript API"
- Click "Enable"
- This allows the map to display

#### 2. **Places API** (Required) ⭐
- Search for "Places API"
- Click "Enable"
- **NOW REQUIRED** for the search bar feature

#### 3. **Maps Embed API** (Recommended)
- Search for "Maps Embed API"
- Click "Enable"
- Provides better map rendering

### Step 3: Verify API Key Restrictions

Go to: https://console.cloud.google.com/apis/credentials

1. Click on your API key
2. Under **Application restrictions**:
   - Choose: **HTTP referrers (web sites)**
   - Add these referrers:
     ```
     http://localhost:5173/*
     https://localhost:5173/*
     http://localhost:*
     https://your-production-domain.com/*
     ```

3. Under **API restrictions**:
   - Choose: **Restrict key**
   - Select:
     - ✅ Maps JavaScript API
     - ✅ Maps Embed API
     - ✅ Places API (if you enabled it)

### Step 4: Restart Your Development Server

After enabling the APIs, restart:

```bash
npm run dev
```

## 🧪 Test the Integration

1. Navigate to: http://localhost:5173
2. Go to the Application Form
3. Scroll to "Pin Your Location on Map"
4. You should see an interactive map centered on Doha, Qatar
5. Click anywhere on the map to set a location

## ❌ Troubleshooting

### "This page can't load Google Maps correctly"
**Solution**: Enable "Maps JavaScript API" in Google Cloud Console

### "Google Maps Platform rejected your request"
**Solution**: Check that your HTTP referrer restrictions include `http://localhost:5173/*`

### Map shows but marker doesn't appear
**Solution**: The AdvancedMarker requires the Maps JavaScript API to be fully enabled

### Billing not enabled error
**Solution**: 
1. Go to https://console.cloud.google.com/billing
2. Enable billing for your project
3. Google provides $200 free credit per month

## 💰 Cost Information

- **Free Tier**: $200 credit/month
- **Map Loads**: ~$7 per 1,000 loads
- **Most small sites**: Stay within free tier
- **Set budget alerts**: Recommended at $50-$100/month

## 🔗 Quick Links

- **Enable APIs**: https://console.cloud.google.com/apis/library
- **API Credentials**: https://console.cloud.google.com/apis/credentials
- **Usage Dashboard**: https://console.cloud.google.com/google/maps-apis/metrics
- **Billing**: https://console.cloud.google.com/billing

## ✅ Success Checklist

- [ ] Maps JavaScript API enabled
- [ ] HTTP referrer restrictions added
- [ ] Billing enabled (if required)
- [ ] Development server restarted
- [ ] Map loads on application form
- [ ] Can click to set location
- [ ] Coordinates display below map

---

**Current Status**: API key added to `.env` - Now enable APIs in Google Cloud Console!

