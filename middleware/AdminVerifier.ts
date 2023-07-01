import {Request, NextFunction, Response} from "express";

const adminVerifier = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAdmin) {
        return res.status(403)
            .json({message: 'Forbidden'})
            .send();
    }
    next();
};

export default adminVerifier;