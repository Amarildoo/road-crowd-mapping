import {number, object, string, TypeOf} from "zod";

/**
 * user schema validation before insert
 */
export const createUserSchema = object({
    body: object({

        username: string({
            required_error: 'Username is required',
        }).min(3, 'Username must be at least 3 characters long'),

        password: string({
            required_error: 'Password is required',
        }).min(6, 'Name must be at least 6 characters long'),

        role: string({
            required_error: 'Role is required',
        }),

    })
});

export type CreateUserInput = TypeOf<typeof createUserSchema>;

/**
 * user schema validation before insert
 */
export const updateUserSchema = object({
    body: object({

        id: number({
            required_error: 'Id is required',
        }).positive('Id must be a positive number'),

        username: string({
            required_error: 'Username is required',
        }).min(3, 'Username must be at least 3 characters long'),

        password: string({
            required_error: 'Password is required',
        }).min(6, 'Name must be at least 6 characters long'),

        role: string({
            required_error: 'Role is required',
        }),

    })
});

export type UpdateUserInput = TypeOf<typeof updateUserSchema>;