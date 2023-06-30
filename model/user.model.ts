//properties required to create a new user
export interface IUserInput {
    email: string;
    name: string;
    password: string;
    role: string;
}

export interface IUserResponse {
    id: number;
    email: string;
    name: string;
    role: string;
}

export class UserResponse implements IUserResponse {
    id: number;
    email: string;
    name: string;
    role: string;

    constructor(id: number, email: string, name: string, role: string) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
    }
}