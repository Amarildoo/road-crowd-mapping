import * as z from 'zod';

export const resLimitPramSchema = z.object({
    params: z.object({

        resLimit: z.string()
            .transform(value => parseInt(value, 10))
            .refine(value => !isNaN(value), {
                message: 'Invalid limit format'
            }).refine(value => value > 0, {
                message: 'Limit should be > 0'
            })

    })
});