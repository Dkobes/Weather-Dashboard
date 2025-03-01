import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const apiKey: string = process.env.API_KEY || 'default-api-key';

// Define an interface for the Coordinates object
interface Coordinates {
    latitude: number;
    longitude: number;
}

// Define a class for the Weather object
class Weather {
    city: string;
    date: string;
    icon: string;
    iconDescription: string;
    tempF: number;
    windSpeed: number;
    humidity: number;

    constructor(city: string, date: string, icon: string, iconDescription: string, tempF : number, windSpeed: number,  humidity: number) {
        this.city = city;
        this.date = date;
        this.icon = icon;
        this.iconDescription = iconDescription;
        this.tempF = tempF;
        this.windSpeed = windSpeed;
        this.humidity = humidity;
    }
}

// Complete the WeatherService class
class WeatherService {
    // Define the baseURL, API key, and city name properties
    private baseURL: string;
    private apiKey: string;
    private cityName: string;

    constructor(cityName: string) {
        this.baseURL = 'https://api.openweathermap.org/data/2.5/';
        this.apiKey = apiKey;
        this.cityName = cityName;
    }

    // Create fetchLocationData method
    private async fetchLocationData(query: string): Promise<any> {
        const apiUrl = `${this.baseURL}weather?${query}`;
        try {
            const response = await axios.get(apiUrl);
            return response.data;
        } catch (error) {
            console.error('Error fetching location data:', error);
            throw new Error('Failed to fetch location data.');
        }
    }

    // Create destructureLocationData method
    private destructureLocationData(locationData: any): Coordinates {
        const { coord: { lat, lon } } = locationData;
        return { latitude: lat, longitude: lon };
    }

    // Create buildGeocodeQuery method
    private buildGeocodeQuery(cityName: string): string {
        return `q=${cityName}&appid=${this.apiKey}`;
    }

    // Create buildWeatherQuery method
    private buildWeatherQuery(coordinates: Coordinates): string {
        const { latitude, longitude } = coordinates;
        return `weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}`;
    }

    // Create fetchAndDestructureLocationData method
    private async fetchAndDestructureLocationData(): Promise<Coordinates> {
        const query = this.buildGeocodeQuery(this.cityName);
        const locationData = await this.fetchLocationData(query);
        return this.destructureLocationData(locationData);
    }

    // Create fetchWeatherData method
    private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
        const query = this.buildWeatherQuery(coordinates);
        const apiUrl = `${this.baseURL}${query}`;
        try {
            const response = await axios.get(apiUrl);
            return response.data;
        } catch (error) {
            console.error('Error fetching weather data.', error);
            throw new Error('Failed to fetch weather data.');
        }
    }

    // Build parseCurrentWeather method
    private parseCurrentWeather(response: any): Weather {
        const {
            name: city,
            dt: date,
            main: { temp: tempF, humidity },
            wind: { speed: windSpeed },
            weather
        } = response;
        
        const { icon, description: iconDescription } = weather[0];
        return new Weather(city, date, icon, iconDescription, tempF, windSpeed, humidity);
    }

    // Complete buildForecastArray method
    private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
        const forecastArray: Weather[] = [currentWeather];
        weatherData.forEach((item) => {
            const weather = new Weather(
                item.name,
                item.dt,
                item.weather[0].icon,
                item.weather[0].description,
                item.main.temp,
                item.wind.speed,
                item.main.humidity,

            );
            forecastArray.push(weather);
        });
        return forecastArray;
    }

    // Complete getWeatherForCity method
    async getWeatherForCity(city: string): Promise<Weather[]> {
        this.cityName = city;
        const coordinates = await this.fetchAndDestructureLocationData();
        const weatherData = await this.fetchWeatherData(coordinates);
        const currentWeather = this.parseCurrentWeather(weatherData);
        return this.buildForecastArray(currentWeather, weatherData);
    }
}

export default WeatherService;
