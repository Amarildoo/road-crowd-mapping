import * as http from "http";
import logger from "../util/logger";

export function getCitiesByLocation(gpsLat: number, gpsLong: number): Promise<unknown> {
    const mapKey = process.env.MAP_KEY || 'no key';
    const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${gpsLat}&lon=${gpsLong}&limit=5&appid=${mapKey}`
    logger.info("sending http request to url: " + url);

    return new Promise((resolve, reject) => {
        http.get(url, res => {
            let data = '';

            res.on('data', chunk => {
                data += chunk;
            });

            res.on('end', () => {
                const locationData = JSON.parse(data);
                console.log(locationData);
                resolve(locationData);
            });
        }).on('error', err => {
            logger.error("Error fetching location data: " + err);
            reject(err);
        });

    });

}
