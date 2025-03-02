import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  filePath: string;
  cities: City[];

  constructor() {
    this.filePath = path.join(__dirname, '../../db/searchHistory.json');
    this.cities = [];
  }


  // TODO: Define a read method that reads from the searchHistory.json file
   private async read(): Promise<City[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filePath, 'utf8', (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            resolve([]);
          } else {
            reject(err);
          }
        } else {
          resolve(JSON.parse(data || '[]'));
        }
      })
    })
   }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.filePath, JSON.stringify(cities, null, 2), 'utf8', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
   async getCities(): Promise<City[]> {
    return this.read();
   }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
   async addCity(city: string): Promise<void> {
    const cities = await this.read();
    const newCity: City = {
      id: cities.length + 1,
      name: city
    };
    cities.push(newCity);
    await this.write(cities);
   }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file

 }

export default new HistoryService();
