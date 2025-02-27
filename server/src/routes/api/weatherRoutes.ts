import { Router } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();
const apiKey = process.env.API_KEY || 'default-api-key';

// TODO: POST Request with city name to retrieve weather data
    // TODO: GET weather data from city name
    // TODO: save city to search history
    // TODO: GET search history
router.post('/weather', async (req, res) => {
  const cityName = req.body.city;

  try {
    const weatherService = new WeatherService(apiKey);
    const weatherData = await weatherService.getWeatherForCity(cityName);
    await HistoryService.addCity(cityName);
    res.json(weatherData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve weather data.' });
  }
});

router.get('/weather/:city', async (req, res) => {
  const cityName = req.params.city;

  try {
    const weatherService = new WeatherService(apiKey);
    const weatherData = await weatherService.getWeatherForCity(cityName);
    res.json(weatherData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

// * BONUS TODO: DELETE city from search history
// router.delete('/history/:id', async (req, res) => {
//   try {
//     const id = parseInt(req.params.id, 10);
//     if (isNaN(id) || id < 0 || id >= searchHistory.length) {
//       return res.status(400).json({ error: 'Invalid ID.' });
//     }

//     const removedCity = await HistoryService.removeCity();

//     return res.status(200).json({ message: 'City removed.', removedCity });
//   } catch (error) {
//     console.error('Error deleting city from search history.', error);
//     return res.status(500).json({ error: 'Failed to delete city from search history.' });
//   }
// });

export default router;
