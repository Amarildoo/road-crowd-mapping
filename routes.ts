import {Express, Request, Response} from 'express';
import {
    createUserHandler,
    deleteUserHandler,
    getAllUsersHandler,
    updateUserHandler, usersByMostObsApprovedHandler, usersByMostObsHandler, usersByMostObsRejectedHandler
} from "./controller/user.controller";
import validateResource from "./middleware/ValidateResource";
import {createUserSchema, updateUserSchema, userIdPramSchema} from "./schema/user.schema";
import {
    approveObsByIdHandler,
    approveObsByTypeHandler,
    approveObsByUserHandler,
    createObservationHandler,
    deleteObservationByIdHandler,
    getObservationsByIdHandler,
    getObservationsByLoggedUserHandler,
    getObservationsByStatusHandler,
    getObservationsByTypeHandler,
    rejectObsByIdHandler,
    rejectObsByUserHandler,
    updateObservationHandler
} from "./controller/observation.controller";
import {
    createObservationSchema,
    obsIdPramSchema,
    obsTypeQuerySchema,
    statusObsSchema,
    updateObservationSchema
} from "./schema/observation.schema";
import {authenticateSchema} from "./schema/auth.schema";
import {authenticationHandler} from "./controller/authentication.controller";
import tokenAuthenticator from "./middleware/authentication";
import adminVerifier from "./middleware/AdminVerifier";
import {resLimitPramSchema} from "./schema/app.schema";

/**
 * definition of routes and request validators (using ZOD)
 */
function routes(app: Express) {

    app.get('/', (req, res) => {
        res.send('Hello World from Express server with TS!')
    });

    //authentication
    app.post("/authenticate", validateResource(authenticateSchema), authenticationHandler);

    //users routes
    app.post("/users", [validateResource(createUserSchema), tokenAuthenticator, adminVerifier], createUserHandler);
    app.put("/users", [validateResource(updateUserSchema), tokenAuthenticator, adminVerifier], updateUserHandler);
    app.get("/users", [tokenAuthenticator, adminVerifier], getAllUsersHandler);
    app.get("/users/most-observations/limit/:resLimit",
        [validateResource(resLimitPramSchema), tokenAuthenticator, adminVerifier],
        usersByMostObsHandler);
    app.get("/users/most-observations/approved/limit/:resLimit",
        [validateResource(resLimitPramSchema), tokenAuthenticator, adminVerifier],
        usersByMostObsApprovedHandler);
    app.get("/users/most-observations/rejected/limit/:resLimit",
        [validateResource(resLimitPramSchema), tokenAuthenticator, adminVerifier],
        usersByMostObsRejectedHandler);
    app.delete("/users/:userId", [tokenAuthenticator, adminVerifier], deleteUserHandler);

    //observation routes
    app.post("/observations", [validateResource(createObservationSchema), tokenAuthenticator],
        createObservationHandler);
    app.put("/observations", [validateResource(updateObservationSchema), tokenAuthenticator],
        updateObservationHandler);
    app.get("/observations/by-status/", [validateResource(statusObsSchema), tokenAuthenticator, adminVerifier],
        getObservationsByStatusHandler);
    app.get("/observations/mine", [tokenAuthenticator], getObservationsByLoggedUserHandler);
    app.get("/observations/mine/id/:obsId", [validateResource(obsIdPramSchema), tokenAuthenticator], getObservationsByIdHandler);
    app.get("/observations/by-type", [validateResource(obsTypeQuerySchema), tokenAuthenticator, adminVerifier],
        getObservationsByTypeHandler);
    app.delete("/observations/:obsId", [validateResource(obsIdPramSchema), tokenAuthenticator],
        deleteObservationByIdHandler);
    app.put("/observations/approve/type/", [tokenAuthenticator, adminVerifier], approveObsByTypeHandler);
    app.put("/observations/approve/id/:obsId",
        [validateResource(obsIdPramSchema), tokenAuthenticator, adminVerifier],
        approveObsByIdHandler);
    app.put("/observations/reject/:obsId",
        [validateResource(obsIdPramSchema), tokenAuthenticator, adminVerifier],
        rejectObsByIdHandler);
    app.put("/observations/approve/user/:userId",
        [validateResource(userIdPramSchema), tokenAuthenticator, adminVerifier],
        approveObsByUserHandler);
    app.put("/observations/reject/user/:userId",
        [validateResource(userIdPramSchema), tokenAuthenticator, adminVerifier],
        rejectObsByUserHandler);

}

export default routes;