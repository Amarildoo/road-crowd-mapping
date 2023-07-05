import logger from '../util/logger';
import {
    IUserInput,
    IUserResponse,
    IUserTotalObs,
    IUserUpdateInput,
    User,
    UserResponse,
    UserTotalObs
} from "../model/user.model";
import {Op} from "sequelize";
import {ObsStatus} from "../model/ObservationStatus";
import sequelize from "../database";
import { QueryTypes } from 'sequelize';

export async function createUser(userRequest: IUserInput): Promise<IUserResponse | undefined> {
    logger.info("creating user:" + JSON.stringify(userRequest));

    //check if user already exists
    const userFound = await User.findOne({where: {username: userRequest.username}});
    if (userFound !== null) {
        logger.error("user already exists");
        throw new Error("User with same username already exists");
    }

    //map fields to user model
    let user: User = new User();
    user.username = userRequest.username;
    user.password = userRequest.password;
    user.role = userRequest.role.toLowerCase(); //db required lowercase

    try { //save user to DB
        await user.save();
    } catch (error: Error | any) {
        logger.error(error);
        return undefined;
    }

    //create response object with generated ID
    return new UserResponse(user.id, userRequest.username, userRequest.role);
}

export async function updateUser(userRequest: IUserUpdateInput): Promise<UserResponse | undefined> {
    logger.info("updating user:" + JSON.stringify(userRequest));
    try {
        const userFound = await User.findByPk(userRequest.id);
        if (userFound === null) {
            logger.error("user not found");
            return undefined;
        }

        //check if another user exists with same username
        const anotherUserFound = await User.findOne(
            {
                where: {
                    username: userRequest.username,
                    id: {[Op.ne]: userRequest.id}
                }
            });
        if (anotherUserFound !== null) {
            logger.error("Another user with same username exists");
            throw new Error("Another user with same username exists");
        }

        // Update user properties
        userFound.username = userRequest.username;
        userFound.password = userRequest.password;
        userFound.role = userRequest.role.toLowerCase(); //db required lowercase

        try {
            await userFound.save();
        } catch (error: Error | any) {
            logger.error("error updating user properties: " + JSON.stringify(error));
            return undefined;
        }
        return new UserResponse(userFound.id, userFound.username, userFound.role);
    } catch (error) {
        logger.error("error updating user: " + JSON.stringify(error));
        return undefined;
    }
}

export async function getByUsername(username: string): Promise<User | null> {
    return User.findOne({where: {username: username}});
}

export function getAllUsers(): Promise<User[]> {
    return User.findAll();
}

export async function getUsersWithMostObservations(limit: number): Promise<IUserTotalObs[]> {
    try {

        const query = "select u.id, u.username, count(o.id) as total" +
            " from \"user\" as u inner join observation o on u.id = o.created_by" +
            " group by u.id, u.username" +
            " order by total desc limit :limit;"
        const params = {limit: limit};

        const result = await sequelize.query(query,
            {
                replacements: params,
                type: QueryTypes.SELECT,
            });

        //map result
        const mappedResult: UserTotalObs[] = result.map(
            (row: any) => (new UserTotalObs(row.id, row.username, row.total)));
        return mappedResult;

    } catch (error) {
        console.error('Error getting users with most observations:', error);
        throw error;
    }
}

export async function getUsersWithMostApprovedObservations(limit: number): Promise<IUserTotalObs[]> {
    try {

        const query = "select u.id, u.username, count(o.id) as total" +
            " from \"user\" as u inner join observation o on u.id = o.created_by" +
            " where o.status = :accepted" +
            " group by u.id, u.username" +
            " order by total desc limit :limit;";
        const params = {
            accepted: ObsStatus.ACCEPTED,
            limit: limit
        };

        const result = await sequelize.query(query,
            {
                replacements: params,
                type: QueryTypes.SELECT,
            });

        //map result
        const mappedResult: UserTotalObs[] = result.map(
            (row: any) => (new UserTotalObs(row.id, row.username, row.total)));
        return mappedResult;

    } catch (error) {
        console.error('Error getting users with most observations:', error);
        throw error;
    }
}

export async function getUsersWithMostRejectedObservations(limit: number): Promise<IUserTotalObs[]> {
    try {

        const query = "select u.id, u.username, count(o.id) as total" +
            " from \"user\" as u inner join observation o on u.id = o.created_by" +
            " where o.status = :accepted" +
            " group by u.id, u.username" +
            " order by total desc limit :limit;";
        const params = {
            accepted: ObsStatus.REJECTED,
            limit: limit
        };

        const result = await sequelize.query(query,
            {
                replacements: params,
                type: QueryTypes.SELECT,
            });

        //map result
        const mappedResult: UserTotalObs[] = result.map(
            (row: any) => (new UserTotalObs(row.id, row.username, row.total)));
        return mappedResult;

    } catch (error) {
        console.error('Error getting users with most observations:', error);
        throw error;
    }
}

export async function deleteById(id: number): Promise<number> {
    logger.info("deleting user by id: " + id);
    try {
        const deletedRows: number = await User.destroy({
            where: {
                id: id,
            },
        });
        return deletedRows; // Return the number of deleted rows
    } catch (error) {
        logger.error("error deleting user by id: " + id);
        throw error; // or return an appropriate value
    }
}
