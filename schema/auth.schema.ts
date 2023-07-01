import {object, string, TypeOf} from "zod";

/**
 * user schema validation before insert
 */
export const authenticateSchema = object({
    body: object({

        username: string({
            required_error: 'Username is required',
        }).min(3, 'Username must be at least 3 characters long'),

        password: string({
            required_error: 'Password is required',
        }).min(6, 'Name must be at least 6 characters long'),

    })
});

export type AuthenticateInput = TypeOf<typeof authenticateSchema>;
