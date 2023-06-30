import {object, string, TypeOf} from "zod";

/**
 * user schema validation before insert
 */
export const createUserSchema = object({
    body: object({

        name: string({
            required_error: 'Name is required',
        }).min(3, 'Name must be at least 3 characters long'),

        password: string({
            required_error: 'Password is required',
        }).min(6, 'Name must be at least 6 characters long'),

        role: string({
            required_error: 'Role is required',
        }),

        email: string({
            required_error: 'Email is required',
        }).email('Not a valid email'),

    })
});

export type CreateUserInput = TypeOf<typeof createUserSchema>;