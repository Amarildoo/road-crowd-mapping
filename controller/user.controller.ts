import {Request, Response} from "express";
import logger from "../util/logger";
import {createUser, deleteById, getAllUsers, updateUser} from "../service/user.service";
import {CreateUserInput, UpdateUserInput} from "../schema/user.schema";
import {IUserResponse, User, UserResponse} from "../model/user.model";
import {UserRole} from "../model/UserRole";
import {getValidEnumValue} from "../util/enum.util";

export async function createUserHandler(
    req: Request<{}, {}, CreateUserInput['body']>, res: Response) {
    try {
        const userRequest = req.body;

        //validate if type is part of enum list
        const enumVal = getValidEnumValue(userRequest.role, UserRole);
        if (!enumVal) {
            logger.info("user role doesn't exist: ", userRequest.role)
            return res.status(400)
                .send('user role name not valid');
        }

        const userResponse = await createUser(userRequest);
        if (!userResponse) {
            return res.status(500)
                .send('Oops! Something went wrong. Please try again later.');
        }
        return res.status(201) //created
            .send(userResponse);
    } catch (e: any) {
        logger.error(e);
        return res.status(500)
            .send(e);
    }
}

export async function updateUserHandler(
    req: Request<{}, {}, UpdateUserInput['body']>, res: Response) {
    try {
        const userRequest = req.body;

        //validate if type is part of enum list
        const enumVal = getValidEnumValue(userRequest.role, UserRole);
        if (!enumVal) {
            logger.info("user role doesn't exist: ", userRequest.role)
            return res.status(400)
                .send('user role name not valid');
        }

        const userResponse = await updateUser(userRequest);
        if (!userResponse) {
            return res.status(500)
                .send('Oops! Something went wrong. Please try again later.');
        }
        return res.status(200)
            .send(userResponse);
    } catch (e: any) {
        logger.error(e);
        return res.status(500)
            .send(e);
    }
}

export async function getAllUsersHandler(req: Request, res: Response) {
    try {
        const users: User[] = await getAllUsers();
        let restList: IUserResponse[] = new Array<IUserResponse>;
        //map to response object (ignoring password field)
        users.forEach(u => restList.push(new UserResponse(u.id, u.username, u.role)));
        //return list of users
        return res.status(200)
            .send(restList);
    } catch (error) {
        console.error('Error retrieving users:', error);
        return res.status(200)
            .send(error);
    }
}

export async function deleteUserHandler(req: Request, res: Response) {
    //todo: check if user is admin
    //manual param validation
    if (!req.params.userId) {
        return res.status(400)
            .send('User id is required');
    } else if (isNaN(parseInt(req.params.userId))) {
        return res.status(400)
            .send('User id must be a number');
    }

    const id: number = parseInt(req.params.userId);
    try {
        const deletedRows = await deleteById(id);
        if (deletedRows === 0) {
            logger.info('User not found: ', id);
            return res.status(404)
                .send('User not found');
        }
        return res.status(200)
            .send('User Deleted');
    } catch (error) {
        return res.status(500)
            .send(error);
    }
}
