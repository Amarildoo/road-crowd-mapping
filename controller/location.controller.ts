import {Request, Response} from "express";
import {getCitiesByLocation} from "../service/location.service";

export async function locationByGpsHandler(req: Request, res: Response) {
    const gpsLong = req.query.gpsLong!.toString();
    const gLongNumber: number = parseFloat(gpsLong);
    if (isNaN(gLongNumber)) {
        return res.status(400)
            .json({message: 'Invalid Longitude value'})
            .send();
    }

    const gpsLat = req.query.gpsLat!.toString();
    const gLatNumber: number = parseFloat(gpsLat);
    if (isNaN(gLatNumber)) {
        return res.status(400)
            .json({message: 'Invalid Latitude value'})
            .send();
    }

    getCitiesByLocation(gLatNumber, gLongNumber)
        .then((cities) => {
            return res.status(200)
                .json({apiRes: cities})
                .send();
        })
        .catch(err => {
            return res.status(500)
                .json({message: err.message})
                .send();
        });
}
