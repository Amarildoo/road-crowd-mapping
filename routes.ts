import {Express, Request, Response} from 'express';
import {createUserHandler, getAllUsersHandler} from "./controller/user.controller";
import validateResource from "./middleware/ValidateResource";
import {createUserSchema} from "./schema/user.schema";

/**
 * definition of routes and request validators (using ZOD)
 * @param app
 */
function routes(app: Express) {

    app.get("/healthcheck", (req: Request, res: Response) => {
        res.sendStatus(200)
    });

    app.post("/users", validateResource(createUserSchema), createUserHandler);

    app.get("/users", getAllUsersHandler);

    app.get('/', (req, res) => {
        res.send('Hello World from Express server with TS!')
    })
}

export default routes;