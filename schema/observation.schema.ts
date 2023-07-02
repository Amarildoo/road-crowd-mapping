import * as z from 'zod';
import {getValidEnumValue} from "../util/enum.util";
import {ObsType} from "../model/ObservationType";

export const createObservationSchema = z.object({
    body: z.object({

        description: z.string({
            required_error: 'Description is required',
        }).min(10, 'Description is too short!'),

        type: z.string({
            required_error: 'Type is required',
        }).min(7, 'Type is too short!'),

        latitude: z.number({
            required_error: 'Latitude location is required',
        }),

        longitude: z.number({
            required_error: 'Longitude location is required',
        }),

    })
});

export const updateObservationSchema = z.object({
    body: z.object({

        id: z.number({
            required_error: 'Id is required',
        }).min(1, 'Id is too short!'),

        description: z.string({
            required_error: 'Description is required',
        }).min(10, 'Description is too short!'),

        type: z.string({
            required_error: 'Type is required',
        }).min(7, 'Type is too short!'),

        latitude: z.number({
            required_error: 'Latitude location is required',
        }),

        longitude: z.number({
            required_error: 'Longitude location is required',
        }),

    })
});

export const statusObsSchema = z.object({
    query: z.object({

        status: z.string({
            required_error: 'Status name is required',
        }).min(7, 'Status name is too short!'),

    })
});

export const obsTypeQuerySchema = z.object({
    query: z.object({

        obsType: z.string({
            required_error: 'Type name is required',
        })
            .refine(value => getValidEnumValue(value, ObsType) != null, {
                message: 'Type is invalid',
            })

    })
});

export const obsIdPramSchema = z.object({
    params: z.object({

        obsId: z.string()
            .transform(value => parseInt(value, 10))
            .refine(value => !isNaN(value), {
                message: 'Invalid ID format'
            }).refine(value => value > 0, {
                message: 'Id should be > 0'
            })

    })
});