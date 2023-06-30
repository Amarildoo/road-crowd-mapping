import {Request, Response, NextFunction} from "express";
import {AnyZodObject} from "zod";

//validate request object against schema
const validate = (schema: AnyZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        next(); //move to next middleware step
    } catch (e: any) {
        //return 400 and the error message
        return res
            .status(400)
            .send(e.errors);
    }
}

export default validate;
