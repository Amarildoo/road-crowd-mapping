import express from 'express';
import config from 'config';
import logger from './util/logger';
import connect from "./util/connection";
import routes from "./routes";

//create express instance
const app = express();

//set port from config file
const port = config.get<number>("port");

//configure middlewares
//add json parser for all requests after this line (meaning all of them in this case (so far))
app.use(express.json());

/**
 * listen on configured port
 * <p>connect to DB</p>
 * <p>config routes</p>
 */
app.listen(port, async () => {
    logger.info(`RCM is running on port ${port}`);
    await connect(); //todo: maybe handle promise to stop the APP if DB connection fails
    routes(app);
});

