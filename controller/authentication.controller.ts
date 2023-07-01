import {Request, Response} from "express";
import logger from "../util/logger";
import {getByUsername} from "../service/user.service";
import {AuthenticateInput} from "../schema/auth.schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function authenticationHandler(
    req: Request<{}, {}, AuthenticateInput['body']>, res: Response) {
    try {
        const bodyRequest = req.body;
        logger.info("authentication request: " + JSON.stringify(bodyRequest));

        const userFound = await getByUsername(bodyRequest.username);
        if (!userFound) {
            return res.status(401)
                .json({message: 'Authentication failed'})
                .send();
        }

        // Compare the provided password with the stored hashed password in DB
        const passwordMatch = await bcrypt.compare(bodyRequest.password, userFound.password);
        if (!passwordMatch) {
            return res.status(401)
                .json({message: 'Authentication failed'})
                .send();
        }

        const JWT_TOKEN: string = process.env.JWT_SECRET || "secret";
        const token = jwt.sign(
            {userId: userFound.id},
            JWT_TOKEN,
            {expiresIn: process.env.JTW_EXPIRATION});

        res.status(200)
            .json({token: token})
            .send();
    } catch (e: any) {
        logger.error(e);
        return res.status(500)
            .send(e);
    }
}
