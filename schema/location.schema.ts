import * as z from 'zod';

export const gpsLocationSchema = z.object({
    query: z.object({

        gpsLong: z.string({
            required_error: 'gpsLong parameter is required',
        }),

        gpsLat: z.string({
            required_error: 'gpsLat parameter is required',
        }),

    })
});