import {Sequelize} from 'sequelize-typescript';
import {User} from "./model/user.model";
import {Observation} from "./model/observation.model";
import env from 'dotenv';

env.config();

const sequelize = new Sequelize({
    database: process.env.DB_SCHEMA || 'rcm',
    username: process.env.DB_USERNAME || 'rcm-username',
    password: process.env.DB_PASSWORD || 'rcm-password',
    dialect: 'postgres',
    host: process.env.DB_HOST || "db",
    port: 5432,
    models: [User, Observation],
    pool: {
        max: 4,
        min: 1,
        acquire: 30000,
        idle: 10000
    }
});

export default sequelize;
