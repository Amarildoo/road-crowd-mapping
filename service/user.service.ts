import logger from '../util/logger';
import {IUserInput, IUserResponse, UserResponse} from "../model/user.model";

export function createUser(userRequest: IUserInput) : IUserResponse | undefined {
    try {
        logger.info("creating user:" + JSON.stringify(userRequest));
        //todo: insert user to db

        //todo: get ID from DB insert
        let res = new UserResponse(1, userRequest.email, userRequest.name, userRequest.role);


        return res;
    } catch (e: any) {
        logger.error(e);
        return undefined;
    }
}

export function getAllUsers(): Array<IUserResponse> {
    //todo: get all users from db
    return [];
}

export async function authenticate(username: string, password: string) {
    //todo: get all users from db
}

export function deleteById(id: number) {
    //todo: delete user from db
}
