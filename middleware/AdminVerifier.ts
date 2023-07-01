import {NextFunction, Response} from "express";
import {UserAuthRequest} from "./authentication";

const adminVerifier = async (req: UserAuthRequest, res: Response, next: NextFunction) => {
    if (!req.isAdmin) {
        return res.status(403)
            .json({message: 'Forbidden'})
            .send();
    }
    next();
};

export default adminVerifier;