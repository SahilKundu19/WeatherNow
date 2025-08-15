# 🔑 OpenWeatherMap API Setup Guide

## Quick Setup Steps

### 1. Get Your Free API Key
1. Visit: https://openweathermap.org/api
2. Click **"Sign Up"** (top right)
3. Fill registration form and verify email
4. Login and go to **"API Keys"** section
5. **Copy** your default API key

### 2. Add API Key to Website
Open your `index.html` file and add this **before** the closing `</body>` tag:

```html
<script>
    window.WEATHER_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
</script>
<script src="script.js"></script>
```

### 3. Replace the Placeholder
Replace `YOUR_ACTUAL_API_KEY_HERE` with your actual API key:

```html
<script>
    window.WEATHER_API_KEY = '1234567890abcdef1234567890abcdef';
</script>
<script src="script.js"></script>
```

### 4. Test Your Website
1. Open `index.html` in your browser
2. Try searching for a city
3. The app should now show real weather data!

## Important Notes

- ✅ **Free Tier**: 1,000 calls/day, 60 calls/minute
- ✅ **No Credit Card Required**
- ⚠️ **API Key Activation**: May take up to 10 minutes
- 🔒 **Keep Your Key Private**: Don't share it publicly

## Troubleshooting

**If you get errors:**
1. Wait 10 minutes after creating account (API activation delay)
2. Check your API key is correctly pasted
3. Make sure you're online
4. Try refreshing the page

## API Usage Limits (Free Plan)
- **Daily Calls**: 1,000 per day
- **Rate Limit**: 60 calls per minute
- **Features**: Current weather + 5-day forecast
- **Coverage**: Worldwide weather data

Perfect for personal projects and testing! 🌤️
