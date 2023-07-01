import logger from '../util/logger';
import {IUserInput, IUserResponse, IUserUpdateInput, User, UserResponse} from "../model/user.model";

export async function createUser(userRequest: IUserInput): Promise<IUserResponse | undefined> {
    logger.info("creating user:" + JSON.stringify(userRequest));

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

export function getAllUsers(): Promise<User[]> {
    return User.findAll();
}

export async function authenticate(username: string, password: string) {
    //todo: get user from db based on username, check password after encryption, return jwt token, jwt exp etc
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
