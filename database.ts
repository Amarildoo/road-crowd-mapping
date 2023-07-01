import { Sequelize } from 'sequelize-typescript';
import {User} from "./model/user.model";
import {Observation} from "./model/observation.model";

const sequelize = new Sequelize({
    //todo: read this from config/env
    database: 'rcm',
    username: 'rcm-username',
    password: 'rcm-password',
    dialect: 'postgres',
    // host: 'db',
    host: 'localhost',
    port: 5432,
    models: [User, Observation],
});

export default sequelize;
