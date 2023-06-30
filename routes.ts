import {Express, Request, Response} from 'express';
import {createUserHandler, getAllUsersHandler} from "./controller/user.controller";
import validateResource from "./middleware/ValidateResource";
import {createUserSchema} from "./schema/user.schema";
import {createObservationHandler, getObservationsByStatusHandler} from "./controller/observation.controller";
import {createObservationSchema, statusObsSchema} from "./schema/observation.schema";

/**
 * definition of routes and request validators (using ZOD)
 */
function routes(app: Express) {

    app.get("/healthcheck", (req: Request, res: Response) => {
        res.sendStatus(200)
    });

    app.get('/', (req, res) => {
        res.send('Hello World from Express server with TS!')
    })

    //users routes
    app.post("/users", validateResource(createUserSchema), createUserHandler);
    app.get("/users", getAllUsersHandler);
    app.delete("/users/:userId", getAllUsersHandler);

    //observation routes
    app.post("/observations", validateResource(createObservationSchema), createObservationHandler);
    app.get("/observations/by-status", validateResource(statusObsSchema), getObservationsByStatusHandler);


}

export default routes;