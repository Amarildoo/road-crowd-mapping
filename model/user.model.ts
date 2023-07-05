import {BeforeCreate, BeforeUpdate, Column, DataType, HasMany, Model, Table} from 'sequelize-typescript';
import {Observation} from "./observation.model";
import bcrypt from 'bcrypt';

@Table({ tableName: 'user', timestamps: false})
export class User extends Model<User> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    username!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
        validate: {
            isIn: [['user', 'admin']],
        },
    })
    role!: string;

    @HasMany(() => Observation, 'created_by')
    observations!: Observation[]; // Make sure the association alias matches the one used in the query

    @BeforeCreate
    static async hashPassword(instance: User) {
        const hashedPassword = await bcrypt.hash(instance.password, 10);
        instance.password = hashedPassword;
    }

    @BeforeUpdate
    static async hashPasswordOnUpdate(instance: User) {
        const hashedPassword = await bcrypt.hash(instance.password, 10);
        instance.password = hashedPassword;
    }

}

//properties required to create a new user
export interface IUserInput {
    username: string;
    password: string;
    role: string;
}

export interface IUserUpdateInput {
    id: number;
    username: string;
    password: string;
    role: string;
}

export interface IUserResponse {
    id: number;
    username: string;
    role: string;
}

export class UserResponse implements IUserResponse {
    id: number;
    username: string;
    role: string;

    constructor(id: number, username: string, role: string) {
        this.id = id;
        this.username = username;
        this.role = role;
    }
}


export interface IUserTotalObs {
    id: number;
    username: string;
    totalObs: number;
}

export class UserTotalObs implements IUserTotalObs {
    id: number;
    username: string;
    totalObs: number;

    constructor(id: number, username: string, totalObs: number) {
        this.id = id;
        this.username = username;
        this.totalObs = totalObs;
    }
}