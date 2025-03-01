import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const filePath = path.join(__dirname, 'searchHistory.json');

// TODO: Define a City class with name and id properties
type City = {
  name: string;
  id: string;
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
   private async read(): Promise<City[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
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
      fs.writeFile(filePath, JSON.stringify(cities, null, 2), 'utf8', (err) => {
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
      id: (cities.length + 1).toString(),
      name: city,
    };
    cities.push(newCity);
    await this.write(cities);
   }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
//    async removeCity(id: string): Promise<void> {
//     const cities = await this.read();
//     const index = cities.findIndex(city => city.id === id);
//     if (index !== -1) {
//       cities.splice(index, 1);
//       await this.write(cities);
//     } else {
//       throw new Error('City not found.');
//    }
//    }
 }

export default new HistoryService();
