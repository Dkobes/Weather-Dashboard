import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

// TODO: Define an interface for the Coordinates object

interface Coordinates {
  latitude: number;
  longitude: number;
}

// TODO: Define a class for the Weather object

class Weather {
  temperature: number;
  humidity: number;
  pressure: number;
  description: string;

  constructor(temperature: number, humidity: number, pressure: number, description: string) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.pressure = pressure;
    this.description = description;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;

  constructor(apiKey: string, cityName: string) {
    this.baseURL = 'https://api.openweathermap.org/data/2.5/';
    this.apiKey = apiKey;
    this.cityName = cityName;
  }

  // TODO: Create fetchLocationData method
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

  // TODO: Create destructureLocationData method
   private destructureLocationData(locationData: any): Coordinates {
    const {coord: { lat, lon } } = locationData;
    return { latitude: lat, longitude: lon };
   }

  // TODO: Create buildGeocodeQuery method
   private buildGeocodeQuery(cityName: string): string {
    return `q=${cityName}&appid=${this.apiKey}`;
   }

  // TODO: Create buildWeatherQuery method
   private buildWeatherQuery(coordinates: Coordinates): string {
    const { latitude, longitude } = coordinates;
    return `weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}`;
   }

  // TODO: Create fetchAndDestructureLocationData method
   private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const query = this.buildGeocodeQuery(this.cityName);
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
   }

  // TODO: Create fetchWeatherData method
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

  // TODO: Build parseCurrentWeather method
   private parseCurrentWeather(response: any): Weather {
    const { main: { temp, humidity, pressure }, weather } = response;
    const description = weather[0].description;
    return new Weather(temp, humidity, pressure, description);
   }

  // TODO: Complete buildForecastArray method
   private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecastArray: Weather[] = [currentWeather];
    weatherData.forEach((item) => {
      const weather = new Weather(
        item.main.temp,
        item.main.humidity,
        item.main.pressure,
        item.weather[0].description
      );
      forecastArray.push(weather);
    });
    return forecastArray;
   }

  // TODO: Complete getWeatherForCity method
   async getWeatherForCity(city: string): Promise<Weather[]> {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    return this.buildForecastArray(currentWeather, weatherData);
   }

}

export default new WeatherService();
