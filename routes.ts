import {Express, Request, Response} from 'express';
import {
    createUserHandler,
    deleteUserHandler,
    getAllUsersHandler,
    updateUserHandler
} from "./controller/user.controller";
import validateResource from "./middleware/ValidateResource";
import {createUserSchema, updateUserSchema} from "./schema/user.schema";
import {createObservationHandler, getObservationsByStatusHandler} from "./controller/observation.controller";
import {createObservationSchema, statusObsSchema} from "./schema/observation.schema";
import {authenticateSchema} from "./schema/auth.schema";
import {authenticationHandler} from "./controller/authentication.controller";
import tokenAuthenticator from "./middleware/authentication";
import adminVerifier from "./middleware/AdminVerifier";

/**
 * definition of routes and request validators (using ZOD)
 */
function routes(app: Express) {

    app.get("/healthcheck", (req: Request, res: Response) => {
        res.sendStatus(200)
    });

    app.get('/', (req, res) => {
        res.send('Hello World from Express server with TS!')
    });

    //users routes
    app.post("/users", [validateResource(createUserSchema), tokenAuthenticator, adminVerifier], createUserHandler);
    app.put("/users", [validateResource(updateUserSchema), tokenAuthenticator, adminVerifier], updateUserHandler);
    app.get("/users", [tokenAuthenticator, adminVerifier], getAllUsersHandler);
    app.delete("/users/:userId", [tokenAuthenticator, adminVerifier], deleteUserHandler);

    //authentication
    app.post("/authenticate", validateResource(authenticateSchema), authenticationHandler);

    //observation routes
    app.post("/observations", validateResource(createObservationSchema), createObservationHandler);
    app.get("/observations/by-status", validateResource(statusObsSchema), getObservationsByStatusHandler);


}

export default routes;