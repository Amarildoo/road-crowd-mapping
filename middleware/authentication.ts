import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import {get} from "lodash";
import {User} from '../model/user.model';

//custom interface to include extra user properties in request, so they can pass throw middlewares and controller
export interface UserAuthRequest extends Request {
    currentUser?: User;
    isAdmin?: boolean;
}

const tokenAuthenticator = async (req: UserAuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = get(req, "headers.authorization", "")
            .replace(/^Bearer\s/, "");

        if (!token) {
            return res.status(401)
                .json({message: 'Missing JWT token'});
        }

        const jwtSecret = process.env.JWT_SECRET || "secret";
        // Verify and decode the JWT token
        const decoded = jwt.verify(token, jwtSecret) as { userId: number };
        const userId = decoded.userId;

        //verify that user still exists in DB
        const userFound: User | null = await User.findByPk(userId);
        if (!userFound) {
            return res.status(403)
                .json({message: 'Account is deleted!'})
                .send();
        }

        //add user to request object, other middlewares and controller might need them :)
        req.currentUser = userFound;
        req.isAdmin = userFound.role == 'admin';

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        return res.status(403).json({message: 'Invalid or expired JWT token'});
    }
};

export default tokenAuthenticator;