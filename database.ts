import {Sequelize} from 'sequelize-typescript';
import {User} from "./model/user.model";
import {Observation} from "./model/observation.model";

const sequelize = new Sequelize({
    database: process.env.DB_SCHEMA || 'rcm',
    username: process.env.DB_USERNAME || 'rcm-username',
    password: process.env.DB_PASSWORD || 'rcm-password',
    dialect: 'postgres',
    host: process.env.DB_HOST || "localhost",
    port: 5432,
    models: [User, Observation],
});

export default sequelize;
