import {Request, Response} from "express";
import logger from "../util/logger";
import {createUser, deleteById, getAllUsers} from "../service/user.service";
import {CreateUserInput} from "../schema/user.schema";

export async function createUserHandler(
    req: Request<{}, {}, CreateUserInput['body']>, res: Response) {
    try {
        const userRequest = req.body;
        //todo: create role enum and check if user requested valid role name

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

export async function deleteUserHandler(req: Request, res: Response) {
    //todo: check if user is admin
    const id = req.params.id;
    deleteById(parseInt(id));
    res.status(200);
}
