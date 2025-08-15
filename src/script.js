// Weather App JavaScript
class WeatherApp {
    constructor() {
        // You'll need to get your own API key from OpenWeatherMap
        this.apiKey = 'YOUR_API_KEY_HERE';
        this.baseUrl = 'https://api.openweathermap.org/data/2.5/';
        this.currentUnit = 'metric'; // 'metric' for Celsius, 'imperial' for Fahrenheit
        
        this.initializeApp();
        this.bindEvents();
        this.loadDefaultWeather();
    }

    initializeApp() {
        this.elements = {
            searchInput: document.getElementById('cityInput'),
            searchBtn: document.getElementById('searchBtn'),
            locationBtn: document.getElementById('locationBtn'),
            themeToggle: document.getElementById('themeToggle'),
            loading: document.getElementById('loading'),
            error: document.getElementById('error'),
            errorMessage: document.getElementById('errorMessage'),
            weatherDisplay: document.getElementById('weatherDisplay'),
            currentLocation: document.getElementById('currentLocation'),
            currentDate: document.getElementById('currentDate'),
            currentTemp: document.getElementById('currentTemp'),
            feelsLike: document.getElementById('feelsLike'),
            weatherDescription: document.getElementById('weatherDescription'),
            weatherIcon: document.getElementById('weatherIcon'),
            visibility: document.getElementById('visibility'),
            humidity: document.getElementById('humidity'),
            windSpeed: document.getElementById('windSpeed'),
            pressure: document.getElementById('pressure'),
            uvIndex: document.getElementById('uvIndex'),
            cloudCover: document.getElementById('cloudCover'),
            // AQI elements
            aqiValue: document.getElementById('aqiValue'),
            aqiCategory: document.getElementById('aqiCategory'),
            pm25: document.getElementById('pm25'),
            so2: document.getElementById('so2'),
            no2: document.getElementById('no2'),
            o3: document.getElementById('o3'),
            favoriteBtn: document.getElementById('favoriteBtn'),
            // Sun times elements
            sunriseTime: document.getElementById('sunriseTime'),
            sunsetTime: document.getElementById('sunsetTime'),
            sunPosition: document.getElementById('sunPosition'),
            // Favorites modal elements
            favoritesBtn: document.getElementById('favoritesBtn'),
            favoritesModal: document.getElementById('favoritesModal'),
            favoritesList: document.getElementById('favoritesList'),
            closeFavorites: document.getElementById('closeFavorites'),
            // Hourly forecast elements
            hourlyContainer: document.querySelector('.hourly-container'),
            // Search suggestions elements
            searchWrapper: document.querySelector('.search-wrapper'),
            searchSuggestions: document.getElementById('searchSuggestions')
        };

        // Initialize theme
        this.initializeTheme();
    }

    bindEvents() {
        // Search functionality
        this.elements.searchBtn.addEventListener('click', () => this.handleSearch());
        this.elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        // Location functionality
        this.elements.locationBtn.addEventListener('click', () => this.getCurrentLocation());

        // Theme toggle functionality
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Favorite functionality
        if (this.elements.favoriteBtn) {
            this.elements.favoriteBtn.addEventListener('click', () => this.toggleFavorite());
        }

        // Favorites modal functionality
        if (this.elements.favoritesBtn) {
            this.elements.favoritesBtn.addEventListener('click', () => this.openFavoritesModal());
        }
        if (this.elements.closeFavorites) {
            this.elements.closeFavorites.addEventListener('click', () => this.closeFavoritesModal());
        }
        if (this.elements.favoritesModal) {
            this.elements.favoritesModal.addEventListener('click', (e) => {
                if (e.target === this.elements.favoritesModal) {
                    this.closeFavoritesModal();
                }
            });
        }

        // Search suggestions functionality
        this.initializeSearchSuggestions();

        // Unit toggle (you can add this feature later)
        document.addEventListener('keypress', (e) => {
            if (e.key === 'y' || e.key === 'Y') {
                this.toggleUnits();
            }
            if (e.key === 'x' || e.key === 'X') {
                this.toggleTheme();
            }
        });
    }

    async loadDefaultWeather() {
        // Try to load weather for current location first, fallback to New York
        try {
            await this.getCurrentLocationWeather();
        } catch (error) {
            console.log('Could not get current location, loading New York as fallback');
            await this.getWeatherByCity('New York');
        }
    }

    async getCurrentLocationWeather() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'));
                return;
            }

            this.showLoading();
            
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        await this.getWeatherByCoords(latitude, longitude);
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                },
                (error) => {
                    // Handle geolocation errors gracefully
                    console.log('Geolocation error:', error.message);
                    reject(error);
                },
                {
                    timeout: 10000, // 10 second timeout
                    enableHighAccuracy: true,
                    maximumAge: 300000 // 5 minutes cache
                }
            );
        });
    }

    async handleSearch() {
        const city = this.elements.searchInput.value.trim();
        if (city) {
            await this.getWeatherByCity(city);
            this.elements.searchInput.value = '';
        }
    }

    async getWeatherByCity(city) {
        this.showLoading();
        try {
            const response = await fetch(
                `${this.baseUrl}weather?q=${city}&appid=${this.apiKey}&units=${this.currentUnit}`
            );
            
            if (!response.ok) {
                throw new Error('City not found');
            }

            const data = await response.json();
            await this.displayWeather(data);
            await this.getForecast(data.coord.lat, data.coord.lon);
            
        } catch (error) {
            this.showError('City not found. Please check the spelling and try again.');
        }
    }

    async getWeatherByCoords(lat, lon) {
        this.showLoading();
        try {
            const response = await fetch(
                `${this.baseUrl}weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=${this.currentUnit}`
            );
            
            if (!response.ok) {
                throw new Error('Weather data not available');
            }

            const data = await response.json();
            await this.displayWeather(data);
            await this.getForecast(lat, lon);
            
        } catch (error) {
            this.showError('Unable to fetch weather data for your location.');
        }
    }

    async getForecast(lat, lon) {
        try {
            const response = await fetch(
                `${this.baseUrl}forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=${this.currentUnit}`
            );
            
            if (!response.ok) {
                throw new Error('Forecast data not available');
            }

            const data = await response.json();
            this.displayForecast(data);
            this.displayHourlyForecast(data);
            
        } catch (error) {
            console.error('Forecast error:', error);
            // Don't show error for forecast, just log it
        }
    }

    async displayWeather(data) {
        // Update location and date
        this.elements.currentLocation.textContent = `${data.name}, ${data.sys.country}`;
        this.elements.currentDate.textContent = this.formatDate(new Date());

        // Update temperature
        this.elements.currentTemp.textContent = Math.round(data.main.temp);
        const unit = this.currentUnit === 'metric' ? '°C' : '°F';
        this.elements.feelsLike.textContent = `${Math.round(data.main.feels_like)}${unit}`;

        // Update weather description
        this.elements.weatherDescription.textContent = 
            data.weather[0].description.replace(/\b\w/g, l => l.toUpperCase());

        // Update weather icon
        this.updateWeatherIcon(data.weather[0].main, data.weather[0].id);

        // Update weather details
        this.elements.visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
        this.elements.humidity.textContent = `${data.main.humidity}%`;
        this.elements.windSpeed.textContent = `${data.wind.speed} m/s`;
        this.elements.pressure.textContent = `${data.main.pressure} hPa`;
        this.elements.cloudCover.textContent = `${data.clouds.all}%`;

        // UV Index would require additional API call (not available in free tier)
        this.elements.uvIndex.textContent = 'N/A';

        // Update sun times
        this.updateSunTimes(data.sys.sunrise, data.sys.sunset);

        // Update AQI with demo data (real API would require additional call)
        this.updateAQI();

        // Check favorite status
        this.checkFavoriteStatus(`${data.name}, ${data.sys.country}`);

        this.hideLoading();
        this.hideError();
        this.showWeatherDisplay();
    }

    displayForecast(data) {
        const forecastContainer = document.querySelector('.forecast-container');
        forecastContainer.innerHTML = ''; // Clear existing forecast

        // Get daily forecasts (every 8th item gives us daily data at same time)
        const dailyForecasts = [];
        for (let i = 0; i < data.list.length; i += 8) {
            if (dailyForecasts.length >= 5) break;
            dailyForecasts.push(data.list[i]);
        }

        dailyForecasts.forEach((forecast, index) => {
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';

            const date = new Date(forecast.dt * 1000);
            const dayName = index === 0 ? 'Today' : 
                           index === 1 ? 'Tomorrow' : 
                           date.toLocaleDateString('en-US', { weekday: 'long' });

            const unit = this.currentUnit === 'metric' ? '°' : '°';
            
            forecastItem.innerHTML = `
                <div class="forecast-day">${dayName}</div>
                <div class="forecast-icon">
                    ${this.getWeatherIconHTML(forecast.weather[0].main, forecast.weather[0].id)}
                </div>
                <div class="forecast-temps">
                    <span class="high-temp">${Math.round(forecast.main.temp_max)}${unit}</span>
                    <span class="low-temp">${Math.round(forecast.main.temp_min)}${unit}</span>
                </div>
            `;

            forecastContainer.appendChild(forecastItem);
        });
    }

    updateWeatherIcon(condition, weatherId) {
        const iconElement = this.elements.weatherIcon;
        iconElement.innerHTML = this.getWeatherIconHTML(condition, weatherId);
        
        // Add weather-specific class for styling
        iconElement.className = 'weather-icon ' + this.getWeatherClass(condition);
    }

    getWeatherIconHTML(condition, weatherId) {
        const iconMap = {
            'Clear': '<i class="fas fa-sun"></i>',
            'Clouds': weatherId === 801 ? '<i class="fas fa-cloud-sun"></i>' : '<i class="fas fa-cloud"></i>',
            'Rain': '<i class="fas fa-cloud-rain"></i>',
            'Drizzle': '<i class="fas fa-cloud-drizzle"></i>',
            'Thunderstorm': '<i class="fas fa-bolt"></i>',
            'Snow': '<i class="fas fa-snowflake"></i>',
            'Mist': '<i class="fas fa-smog"></i>',
            'Smoke': '<i class="fas fa-smog"></i>',
            'Haze': '<i class="fas fa-smog"></i>',
            'Dust': '<i class="fas fa-smog"></i>',
            'Fog': '<i class="fas fa-smog"></i>',
            'Sand': '<i class="fas fa-smog"></i>',
            'Ash': '<i class="fas fa-smog"></i>',
            'Squall': '<i class="fas fa-wind"></i>',
            'Tornado': '<i class="fas fa-tornado"></i>'
        };

        return iconMap[condition] || '<i class="fas fa-question"></i>';
    }

    getWeatherClass(condition) {
        const classMap = {
            'Clear': 'sunny',
            'Clouds': 'cloudy',
            'Rain': 'rainy',
            'Drizzle': 'rainy',
            'Thunderstorm': 'stormy',
            'Snow': 'snowy',
            'Mist': 'cloudy',
            'Smoke': 'cloudy',
            'Haze': 'cloudy',
            'Dust': 'cloudy',
            'Fog': 'cloudy',
            'Sand': 'cloudy',
            'Ash': 'cloudy',
            'Squall': 'stormy',
            'Tornado': 'stormy'
        };

        return classMap[condition] || '';
    }

    getCurrentLocation() {
        if (navigator.geolocation) {
            this.showLoading();
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.getWeatherByCoords(latitude, longitude);
                },
                (error) => {
                    this.showError('Unable to access your location. Please enable location services.');
                }
            );
        } else {
            this.showError('Geolocation is not supported by this browser.');
        }
    }

    toggleUnits() {
        this.currentUnit = this.currentUnit === 'metric' ? 'imperial' : 'metric';
        const currentLocation = this.elements.currentLocation.textContent;
        if (currentLocation && currentLocation !== 'New York, NY') {
            const city = currentLocation.split(',')[0];
            this.getWeatherByCity(city);
        }
    }

    formatDate(date) {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString('en-US', options);
    }

    showLoading() {
        this.elements.loading.classList.remove('hidden');
        this.elements.error.classList.add('hidden');
        this.elements.weatherDisplay.classList.add('hidden');
    }

    hideLoading() {
        this.elements.loading.classList.add('hidden');
    }

    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.error.classList.remove('hidden');
        this.elements.loading.classList.add('hidden');
        this.elements.weatherDisplay.classList.add('hidden');
    }

    hideError() {
        this.elements.error.classList.add('hidden');
    }

    showWeatherDisplay() {
        this.elements.weatherDisplay.classList.remove('hidden');
        // Add entrance animation
        this.elements.weatherDisplay.classList.add('weather-card-enter');
        
        setTimeout(() => {
            this.elements.weatherDisplay.classList.remove('weather-card-enter');
        }, 600);
    }

    // Theme management methods
    initializeTheme() {
        // Check for saved theme preference or default to dark
        const savedTheme = localStorage.getItem('weather-theme') || 'dark';
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        const body = document.body;
        const themeIcon = this.elements.themeToggle.querySelector('i');
        
        if (theme === 'light') {
            body.classList.add('light-theme');
            themeIcon.className = 'fas fa-sun';
            this.elements.themeToggle.title = 'Switch to dark mode';
        } else {
            body.classList.remove('light-theme');
            themeIcon.className = 'fas fa-moon';
            this.elements.themeToggle.title = 'Switch to light mode';
        }
        
        this.currentTheme = theme;
        localStorage.setItem('weather-theme', theme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Add a subtle animation to indicate the theme change
        this.elements.themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.elements.themeToggle.style.transform = 'scale(1)';
        }, 150);
    }

    // Sun Times functionality
    updateSunTimes(sunriseTimestamp, sunsetTimestamp) {
        if (!sunriseTimestamp || !sunsetTimestamp) {
            this.elements.sunriseTime.textContent = '06:30 AM';
            this.elements.sunsetTime.textContent = '07:45 PM';
            return;
        }

        const sunrise = new Date(sunriseTimestamp * 1000);
        const sunset = new Date(sunsetTimestamp * 1000);
        const now = new Date();

        // Format times
        this.elements.sunriseTime.textContent = sunrise.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        this.elements.sunsetTime.textContent = sunset.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        // Calculate sun position (simplified)
        const dayDuration = sunset.getTime() - sunrise.getTime();
        const elapsed = now.getTime() - sunrise.getTime();
        let position = 0;

        if (elapsed < 0) {
            position = 0; // Before sunrise
        } else if (elapsed > dayDuration) {
            position = 100; // After sunset
        } else {
            position = (elapsed / dayDuration) * 100;
        }

        this.elements.sunPosition.style.left = `${Math.min(Math.max(position, 0), 100)}%`;
    }

    // AQI functionality (demo data since real API requires additional subscription)
    updateAQI() {
        // Generate demo AQI data
        const aqiValue = Math.floor(Math.random() * 150) + 10; // 10-160
        let category, className;

        if (aqiValue <= 50) {
            category = 'Good';
            className = 'good';
        } else if (aqiValue <= 100) {
            category = 'Moderate';
            className = 'moderate';
        } else if (aqiValue <= 150) {
            category = 'Unhealthy for Sensitive Groups';
            className = 'unhealthy-sensitive';
        } else if (aqiValue <= 200) {
            category = 'Unhealthy';
            className = 'unhealthy';
        } else if (aqiValue <= 300) {
            category = 'Very Unhealthy';
            className = 'very-unhealthy';
        } else {
            category = 'Hazardous';
            className = 'hazardous';
        }

        this.elements.aqiValue.textContent = aqiValue;
        this.elements.aqiValue.className = `aqi-value ${className}`;
        this.elements.aqiCategory.textContent = category;

        // Update pollutant values
        this.elements.pm25.textContent = `${Math.floor(Math.random() * 35) + 5} μg/m³`;
        this.elements.so2.textContent = `${Math.floor(Math.random() * 20) + 2} μg/m³`;
        this.elements.no2.textContent = `${Math.floor(Math.random() * 40) + 10} μg/m³`;
        this.elements.o3.textContent = `${Math.floor(Math.random() * 80) + 20} μg/m³`;
    }

    // Favorite functionality
    toggleFavorite() {
        const icon = this.elements.favoriteBtn.querySelector('i');
        const currentLocation = this.elements.currentLocation.textContent;

        if (icon.classList.contains('far')) {
            // Add to favorites
            icon.classList.remove('far');
            icon.classList.add('fas');
            this.elements.favoriteBtn.classList.add('favorited');
            this.elements.favoriteBtn.title = 'Remove from favorites';
            
            // Save to localStorage (simplified)
            const favorites = JSON.parse(localStorage.getItem('weather-favorites') || '[]');
            if (!favorites.includes(currentLocation)) {
                favorites.push(currentLocation);
                localStorage.setItem('weather-favorites', JSON.stringify(favorites));
            }
        } else {
            // Remove from favorites
            icon.classList.remove('fas');
            icon.classList.add('far');
            this.elements.favoriteBtn.classList.remove('favorited');
            this.elements.favoriteBtn.title = 'Add to favorites';
            
            // Remove from localStorage
            const favorites = JSON.parse(localStorage.getItem('weather-favorites') || '[]');
            const index = favorites.indexOf(currentLocation);
            if (index > -1) {
                favorites.splice(index, 1);
                localStorage.setItem('weather-favorites', JSON.stringify(favorites));
            }
        }

        // Add animation
        this.elements.favoriteBtn.style.transform = 'scale(0.8)';
        setTimeout(() => {
            this.elements.favoriteBtn.style.transform = 'scale(1)';
        }, 200);
    }

    // Check if current location is favorited
    checkFavoriteStatus(location) {
        const favorites = JSON.parse(localStorage.getItem('weather-favorites') || '[]');
        const icon = this.elements.favoriteBtn.querySelector('i');
        
        if (favorites.includes(location)) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            this.elements.favoriteBtn.classList.add('favorited');
            this.elements.favoriteBtn.title = 'Remove from favorites';
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            this.elements.favoriteBtn.classList.remove('favorited');
            this.elements.favoriteBtn.title = 'Add to favorites';
        }
    }

    // Favorites modal functionality
    openFavoritesModal() {
        this.displayFavoritesList();
        this.elements.favoritesModal.classList.add('active');
        document.body.classList.add('modal-open');
        
        // Add keyboard event listener for ESC key
        document.addEventListener('keydown', this.handleEscKey.bind(this));
    }

    closeFavoritesModal() {
        this.elements.favoritesModal.classList.remove('active');
        document.body.classList.remove('modal-open');
        
        // Remove keyboard event listener for ESC key
        document.removeEventListener('keydown', this.handleEscKey.bind(this));
    }

    handleEscKey(e) {
        if (e.key === 'Escape') {
            this.closeFavoritesModal();
        }
    }

    displayFavoritesList() {
        const favorites = JSON.parse(localStorage.getItem('weather-favorites') || '[]');
        const favoritesList = this.elements.favoritesList;
        
        favoritesList.innerHTML = '';
        
        if (favorites.length === 0) {
            favoritesList.innerHTML = `
                <div class="no-favorites">
                    <i class="far fa-star"></i>
                    <p>No favorite locations added yet.</p>
                    <span>Add locations by clicking the star icon when viewing weather data.</span>
                </div>
            `;
        } else {
            favorites.forEach((location, index) => {
                const favoriteItem = document.createElement('div');
                favoriteItem.className = 'favorite-item';
                favoriteItem.innerHTML = `
                    <div class="favorite-location" data-location="${location}">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${location}</span>
                    </div>
                    <button class="remove-favorite" data-index="${index}" title="Remove from favorites">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                // Add click event to load weather for this location
                const locationElement = favoriteItem.querySelector('.favorite-location');
                locationElement.addEventListener('click', () => {
                    const cityName = location.split(',')[0];
                    this.getWeatherByCity(cityName);
                    this.closeFavoritesModal();
                });
                
                // Add click event to remove this favorite
                const removeButton = favoriteItem.querySelector('.remove-favorite');
                removeButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.removeFavorite(index);
                });
                
                favoritesList.appendChild(favoriteItem);
            });
        }
    }

    removeFavorite(index) {
        const favorites = JSON.parse(localStorage.getItem('weather-favorites') || '[]');
        favorites.splice(index, 1);
        localStorage.setItem('weather-favorites', JSON.stringify(favorites));
        
        // Update the display
        this.displayFavoritesList();
        
        // Update favorite status if current location was removed
        const currentLocation = this.elements.currentLocation.textContent;
        this.checkFavoriteStatus(currentLocation);
    }

    // Hourly Forecast functionality
    displayHourlyForecast(data) {
        if (!this.elements.hourlyContainer) return;
        
        this.elements.hourlyContainer.innerHTML = ''; // Clear existing hourly data
        
        // Get next 24 hours (8 items, every 3 hours)
        const hourlyData = data.list.slice(0, 8);
        
        hourlyData.forEach((item, index) => {
            const hourlyItem = document.createElement('div');
            hourlyItem.className = 'hourly-item';
            
            const date = new Date(item.dt * 1000);
            const isNow = index === 0;
            const timeString = isNow ? 'Now' : date.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                hour12: true 
            });
            
            const temp = Math.round(item.main.temp);
            const unit = this.currentUnit === 'metric' ? '°' : '°';
            const precipitation = item.pop ? Math.round(item.pop * 100) : 0;
            
            hourlyItem.innerHTML = `
                <div class="hourly-time">${timeString}</div>
                <div class="hourly-icon">
                    ${this.getWeatherIconHTML(item.weather[0].main, item.weather[0].id)}
                </div>
                <div class="hourly-temp">${temp}${unit}</div>
                <div class="hourly-precipitation">
                    <i class="fas fa-tint"></i>
                    ${precipitation}%
                </div>
            `;
            
            this.elements.hourlyContainer.appendChild(hourlyItem);
        });
    }

    // Search Suggestions functionality
    initializeSearchSuggestions() {
        if (!this.elements.searchInput || !this.elements.searchSuggestions) return;
        
        // Debounce timer
        this.searchTimeout = null;
        
        // Event listeners
        this.elements.searchInput.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });
        
        this.elements.searchInput.addEventListener('focus', () => {
            if (this.elements.searchInput.value.trim()) {
                this.handleSearchInput(this.elements.searchInput.value);
            }
        });
        
        this.elements.searchInput.addEventListener('blur', () => {
            // Delay hiding to allow clicking on suggestions
            setTimeout(() => {
                this.hideSuggestions();
            }, 200);
        });
        
        // Handle keyboard navigation
        this.elements.searchInput.addEventListener('keydown', (e) => {
            this.handleSuggestionNavigation(e);
        });
        
        // Initialize selected suggestion index
        this.selectedSuggestionIndex = -1;
    }

    handleSearchInput(value) {
        const query = value.trim();
        
        // Clear previous timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        if (query.length < 2) {
            this.hideSuggestions();
            return;
        }
        
        // Debounce the search
        this.searchTimeout = setTimeout(() => {
            this.fetchSuggestions(query);
        }, 300);
    }

    async fetchSuggestions(query) {
        try {
            this.showSuggestionLoading();
            
            // Use OpenWeatherMap geocoding API for city suggestions
            const response = await fetch(
                `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${this.apiKey}`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch suggestions');
            }
            
            const suggestions = await response.json();
            this.displaySuggestions(suggestions);
            
        } catch (error) {
            console.error('Suggestion fetch error:', error);
            // Fallback to demo suggestions
            this.displayDemoSuggestions(query);
        }
    }

    displaySuggestions(suggestions) {
        this.elements.searchSuggestions.innerHTML = '';
        this.selectedSuggestionIndex = -1;
        
        if (suggestions.length === 0) {
            this.elements.searchSuggestions.innerHTML = `
                <div class="suggestion-item loading">
                    <span>No locations found</span>
                </div>
            `;
            this.showSuggestions();
            return;
        }
        
        suggestions.forEach((suggestion, index) => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            suggestionItem.dataset.index = index;
            
            const locationName = suggestion.name;
            const country = suggestion.country;
            const state = suggestion.state || '';
            const displayName = state ? `${locationName}, ${state}, ${country}` : `${locationName}, ${country}`;
            
            suggestionItem.innerHTML = `
                <i class="suggestion-icon fas fa-map-marker-alt"></i>
                <div class="suggestion-text">
                    <div>${locationName}</div>
                    <div class="suggestion-country">${state ? `${state}, ` : ''}${country}</div>
                </div>
            `;
            
            // Add click event
            suggestionItem.addEventListener('click', () => {
                this.selectSuggestion(displayName, locationName);
            });
            
            this.elements.searchSuggestions.appendChild(suggestionItem);
        });
        
        this.showSuggestions();
    }

    displayDemoSuggestions(query) {
        // Demo fallback suggestions
        const demoSuggestions = [
            { name: 'New York', country: 'US', state: 'NY' },
            { name: 'London', country: 'GB' },
            { name: 'Paris', country: 'FR' },
            { name: 'Tokyo', country: 'JP' },
            { name: 'Sydney', country: 'AU' }
        ].filter(city => 
            city.name.toLowerCase().includes(query.toLowerCase())
        );
        
        this.displaySuggestions(demoSuggestions);
    }

    showSuggestionLoading() {
        this.elements.searchSuggestions.innerHTML = `
            <div class="suggestion-item loading">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Searching...</span>
            </div>
        `;
        this.showSuggestions();
    }

    showSuggestions() {
        this.elements.searchSuggestions.classList.remove('hidden', 'empty');
    }

    hideSuggestions() {
        this.elements.searchSuggestions.classList.add('hidden');
        this.selectedSuggestionIndex = -1;
    }

    handleSuggestionNavigation(e) {
        const suggestions = this.elements.searchSuggestions.querySelectorAll('.suggestion-item:not(.loading)');
        
        if (suggestions.length === 0) return;
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedSuggestionIndex = Math.min(
                    this.selectedSuggestionIndex + 1,
                    suggestions.length - 1
                );
                this.updateSuggestionSelection(suggestions);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedSuggestionIndex = Math.max(
                    this.selectedSuggestionIndex - 1,
                    -1
                );
                this.updateSuggestionSelection(suggestions);
                break;
                
            case 'Enter':
                if (this.selectedSuggestionIndex >= 0) {
                    e.preventDefault();
                    const selectedSuggestion = suggestions[this.selectedSuggestionIndex];
                    selectedSuggestion.click();
                }
                break;
                
            case 'Escape':
                this.hideSuggestions();
                this.elements.searchInput.blur();
                break;
        }
    }

    updateSuggestionSelection(suggestions) {
        // Remove previous selection
        suggestions.forEach(item => item.classList.remove('selected'));
        
        // Add selection to current item
        if (this.selectedSuggestionIndex >= 0) {
            suggestions[this.selectedSuggestionIndex].classList.add('selected');
        }
    }

    selectSuggestion(displayName, cityName) {
        this.elements.searchInput.value = displayName;
        this.hideSuggestions();
        
        // Fetch weather for selected location
        this.getWeatherByCity(cityName);
        
        // Clear search input
        setTimeout(() => {
            this.elements.searchInput.value = '';
        }, 100);
    }
}

// Demo mode for when API key is not available
class DemoWeatherApp extends WeatherApp {
    constructor() {
        super();
        this.isDemoMode = true;
    }

    async getCurrentLocationWeather() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'));
                return;
            }

            this.showLoading();
            
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        await this.getWeatherByCoords(position.coords.latitude, position.coords.longitude);
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                },
                (error) => {
                    console.log('Geolocation error:', error.message);
                    reject(error);
                },
                {
                    timeout: 10000,
                    enableHighAccuracy: true,
                    maximumAge: 300000
                }
            );
        });
    }

    async getWeatherByCity(city) {
        this.showLoading();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Demo data with sunrise/sunset
        const now = new Date();
        const sunriseHour = 6 + Math.floor(Math.random() * 2); // 6-8 AM
        const sunsetHour = 18 + Math.floor(Math.random() * 3); // 6-9 PM
        
        const sunrise = new Date(now);
        sunrise.setHours(sunriseHour, Math.floor(Math.random() * 60), 0, 0);
        
        const sunset = new Date(now);
        sunset.setHours(sunsetHour, Math.floor(Math.random() * 60), 0, 0);
        
        const demoData = {
            name: city,
            sys: { 
                country: 'US',
                sunrise: Math.floor(sunrise.getTime() / 1000),
                sunset: Math.floor(sunset.getTime() / 1000)
            },
            main: {
                temp: Math.round(Math.random() * 30 + 10), // 10-40°C
                feels_like: Math.round(Math.random() * 30 + 10),
                humidity: Math.round(Math.random() * 60 + 40), // 40-100%
                pressure: Math.round(Math.random() * 50 + 1000) // 1000-1050 hPa
            },
            weather: [{
                main: ['Clear', 'Clouds', 'Rain', 'Snow'][Math.floor(Math.random() * 4)],
                description: 'partly cloudy',
                id: 801
            }],
            visibility: Math.round(Math.random() * 10000 + 5000), // 5-15km
            wind: { speed: Math.round(Math.random() * 20 + 5) }, // 5-25 m/s
            clouds: { all: Math.round(Math.random() * 100) }, // 0-100%
            coord: { lat: 40.7128, lon: -74.0060 }
        };

        await this.displayWeather(demoData);
        this.generateDemoForecast();
        this.generateDemoHourlyForecast();
    }

    generateDemoForecast() {
        const forecastContainer = document.querySelector('.forecast-container');
        forecastContainer.innerHTML = '';

        const days = ['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday'];
        const weatherTypes = ['Clear', 'Clouds', 'Rain', 'Snow'];
        
        days.forEach(day => {
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';

            const condition = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
            const highTemp = Math.round(Math.random() * 15 + 20); // 20-35°C
            const lowTemp = Math.round(highTemp - Math.random() * 10); // 10°C lower

            forecastItem.innerHTML = `
                <div class="forecast-day">${day}</div>
                <div class="forecast-icon">
                    ${this.getWeatherIconHTML(condition, 801)}
                </div>
                <div class="forecast-temps">
                    <span class="high-temp">${highTemp}°</span>
                    <span class="low-temp">${lowTemp}°</span>
                </div>
            `;

            forecastContainer.appendChild(forecastItem);
        });
    }

    generateDemoHourlyForecast() {
        if (!this.elements.hourlyContainer) return;
        
        this.elements.hourlyContainer.innerHTML = '';
        
        const now = new Date();
        const weatherTypes = ['Clear', 'Clouds', 'Rain', 'Snow'];
        
        // Generate 8 hourly items (24 hours with 3-hour intervals)
        for (let i = 0; i < 8; i++) {
            const hourlyItem = document.createElement('div');
            hourlyItem.className = 'hourly-item';
            
            const hourTime = new Date(now.getTime() + (i * 3 * 60 * 60 * 1000));
            const timeString = i === 0 ? 'Now' : hourTime.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                hour12: true 
            });
            
            const condition = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
            const temp = Math.round(Math.random() * 15 + 15); // 15-30°C
            const unit = this.currentUnit === 'metric' ? '°' : '°';
            const precipitation = Math.round(Math.random() * 80); // 0-80%
            
            hourlyItem.innerHTML = `
                <div class="hourly-time">${timeString}</div>
                <div class="hourly-icon">
                    ${this.getWeatherIconHTML(condition, 801)}
                </div>
                <div class="hourly-temp">${temp}${unit}</div>
                <div class="hourly-precipitation">
                    <i class="fas fa-tint"></i>
                    ${precipitation}%
                </div>
            `;
            
            this.elements.hourlyContainer.appendChild(hourlyItem);
        }
    }

    async getWeatherByCoords(lat, lon) {
        // Use demo data for coordinates too
        await this.getWeatherByCity('Your Location');
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Check if we have a valid API key
    const hasApiKey = window.WEATHER_API_KEY && window.WEATHER_API_KEY !== 'YOUR_API_KEY_HERE';
    
    if (hasApiKey) {
        const app = new WeatherApp();
        app.apiKey = window.WEATHER_API_KEY;
    } else {
        // Use demo mode
        console.log('Demo mode: To use real weather data, get an API key from OpenWeatherMap and add it to the HTML file');
        new DemoWeatherApp();
    }
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add keyboard shortcuts info
    const shortcutsInfo = document.createElement('div');
    shortcutsInfo.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0,0,0,0.7);
        color: white;
        padding: 10px;
        border-radius: 8px;
        font-size: 12px;
        opacity: 0.7;
        z-index: 1000;
    `;
    shortcutsInfo.innerHTML = 'Press "X" to toggle units • Press "Y" to toggle theme';
    document.body.appendChild(shortcutsInfo);

    // Auto-hide shortcuts info after 5 seconds
    setTimeout(() => {
        shortcutsInfo.style.opacity = '0';
        shortcutsInfo.style.transition = 'opacity 1s ease';
    }, 5000);

    // Add weather background animation
    const createFloatingElement = () => {
        const element = document.createElement('div');
        element.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            animation: float-up ${Math.random() * 3 + 2}s linear infinite;
            left: ${Math.random() * 100}vw;
            top: 100vh;
        `;
        document.body.appendChild(element);

        setTimeout(() => {
            element.remove();
        }, 5000);
    };

    // Add floating animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-up {
            to {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Create floating elements periodically
    setInterval(createFloatingElement, 500);
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WeatherApp, DemoWeatherApp };
}
