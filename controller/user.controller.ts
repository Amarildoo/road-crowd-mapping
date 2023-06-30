import {Request, Response} from "express";
import logger from "../util/logger";
import {createUser, getAllUsers} from "../service/user.service";
import {CreateUserInput} from "../schema/user.schema";
import {omit} from "lodash";

export async function createUserHandler(
    req: Request<{}, {}, CreateUserInput['body']>, res: Response) {
    try {
        const userRequest = req.body;
        const userResponse = createUser(userRequest);
        if (!userResponse) {
            return res.status(500)
                .send('Oops! Something went wrong. Please try again later.');
        }
        res.status(201) //created
            // .send(omit(userResponse, 'password'));
            // .send(omit(userResponse.toJson(), 'password'));
            .send(userResponse);
    } catch (e: any) {
        logger.error(e);
        res.status(500)
            .send(e);
    }
}

export async function getAllUsersHandler(req: Request, res: Response) {
    const resList = getAllUsers();
    res.status(200)
        .send(resList);
}
