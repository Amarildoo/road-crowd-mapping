import 'reflect-metadata';
import express from 'express';
import logger from './util/logger';
import routes from "./routes";
import sequelize from './database';

//load environment variables
require('dotenv').config();

//create express instance
const app = express();

//set port from config file
const port = process.env.PORT || 3001;

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

    try {
        await sequelize.authenticate();
        logger.info('DB connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(0); //kill the app, no DB = no APP :(
    }

    routes(app);

});

