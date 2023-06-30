import * as z from 'zod';

/**
 * observation schema validation (as middleware)
 */
export const createObservationSchema = z.object({
    body: z.object({

        description: z.string({
            required_error: 'Description is required',
        }).min(10, 'Description is too short!'),

        type: z.object({
            property: z.enum(["pothole", "obstacle", "closure"])
        }),

        latitude: z.number({
            required_error: 'Latitude location is required',
        }),

        longitude: z.number({
            required_error: 'Longitude location is required',
        }),

    })
});

export type CreateUserInput = z.TypeOf<typeof createObservationSchema>;