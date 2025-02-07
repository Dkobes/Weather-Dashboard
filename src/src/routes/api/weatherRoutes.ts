import { Router } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
import axios from 'axios';
const router = Router();

// import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';

let searchHistory: string[] = [];

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  try {
    const cityName: string = req.body.city;
    if (!cityName) {
      return res.status(400).son({error: "City name is required."});
    }
    // TODO: GET weather data from city name
    const weatherApiKey = '4cdd90663ed4d6ae98bbb330627d74a0';
    const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${weatherApiKey}';
    
    const weatherResponse = await axios.get(weatherApiUrl);
    const weatherData = weatherResponse.data;

    // TODO: save city to search history
    searchHistory.push(cityName);

    return res.status(200).json(weatherData);
  } catch (error) {
    console.error('Error retrieving data.', error);
    return res.status(500).json({error: 'Failed to retrieve data.'})
  }
});

// TODO: GET search history
router.get('/history', async (req, res) => {});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {});

export default router;
