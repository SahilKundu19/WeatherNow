# WeatherNow - Modern Weather Website

A beautiful, responsive weather website built with HTML, CSS, and JavaScript. Features real-time weather data, 5-day forecasts, and an elegant glassmorphism design.

![WeatherNow Screenshot](https://github.com/SahilKundu19/WeatherNow/blob/bb10a053be5669157f6dfcd662802bdf646c7063/WeatherNow-image.png)

## Features

- 🌤️ **Real-time Weather Data** - Current conditions and detailed metrics
- 📅 **5-Day Forecast** - Extended weather predictions
- 📍 **Location Services** - Get weather for your current location
- 🔍 **City Search** - Search weather for any city worldwide
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Glassmorphism design with smooth animations
- ⌨️ **Keyboard Shortcuts** - Press 'U' to toggle between Celsius/Fahrenheit
- 🚀 **Demo Mode** - Works without API key for demonstration

## Tech Stack

- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with Flexbox, Grid, and animations
- **JavaScript (ES6+)** - Weather API integration and dynamic UI
- **OpenWeatherMap API** - Weather data source
- **Font Awesome** - Weather icons
- **Google Fonts** - Typography (Poppins)

## Getting Started

### Prerequisites

- A modern web browser
- (Optional) OpenWeatherMap API key for real weather data

### Installation

1. **Clone or download the project files**
   ```bash
   git clone <repository-url>
   cd weather-website
   ```

2. **Open the project**
   - Simply open `index.html` in your web browser
   - Or use a local server (recommended):
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js http-server
     npx http-server
     
     # Using Live Server (VS Code extension)
     ```

3. **Add API Key (Optional)**
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Get your free API key
   - Add this script tag to `index.html` before the closing `</body>` tag:
     ```html
     <script>
         window.WEATHER_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
     </script>
     ```

## Usage

### With API Key
1. Search for any city using the search bar
2. Click the location button to use your current location
3. Press 'U' to toggle between Celsius and Fahrenheit
4. View detailed weather information and 5-day forecast

## Project Structure

```
weather-website/
│
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## Features Breakdown

### Weather Information Displayed
- Current temperature and "feels like" temperature
- Weather description and conditions
- Humidity, visibility, wind speed
- Atmospheric pressure and cloud cover
- 5-day weather forecast
- Air Quality Index for pollutants like SO2, NO2, O3, and PM2.5
- Sunrise and Sunset Timings
- Hourly Weather Forecast

### Interactive Elements
- Search functionality with Enter key support
- Geolocation for current position weather
- Responsive design for all screen sizes
- Loading states and error handling
- Smooth animations and transitions

### Design Elements
- Glassmorphism design aesthetic
- Gradient backgrounds
- Floating particle animations
- Hover effects and micro-interactions
- Mobile-first responsive layout

## Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --accent-color: #ffd700;
    --text-light: rgba(255, 255, 255, 0.9);
}
```

### Adding Weather Conditions
Extend the weather icon mapping in `script.js`:
```javascript
const iconMap = {
    'Clear': '<i class="fas fa-sun"></i>',
    'YourCondition': '<i class="fas fa-your-icon"></i>',
    // Add more conditions
};
```

### Responsive Breakpoints
Modify breakpoints in `styles.css`:
```css
@media (max-width: 768px) { /* Tablet styles */ }
@media (max-width: 480px) { /* Mobile styles */ }
```

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 60+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Features

- Lazy loading of weather data
- Efficient DOM manipulation
- CSS animations with GPU acceleration
- Optimized API calls
- Responsive images and icons

## API Integration

The app integrates with OpenWeatherMap API:
- Current Weather API
- 5-Day Forecast API
- 24-Hour Forecast API 
- Air Quality Index API
- Geolocation support
- Error handling for network issues

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Future Enhancements

- [ ] Weather maps integration
- [ ] Weather alerts and notifications
- [ ] Historical weather data
- [ ] Weather-based background themes
- [ ] Offline support with service workers
- [ ] Voice search functionality
- [ ] Widget mode for desktop
- [ ] Weather charts and graphs

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons from [Font Awesome](https://fontawesome.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)
- Design inspiration from modern weather apps

## Support

If you encounter any issues or have questions:
1. Check the browser console for error messages
2. Ensure your API key is correctly configured
3. Verify your internet connection
4. Try refreshing the page

---

Made with ❤️ for weather enthusiasts everywhere!
