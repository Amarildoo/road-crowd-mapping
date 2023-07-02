import {Model, Table, Column, DataType, ForeignKey, BelongsTo} from 'sequelize-typescript';
import {User} from './user.model';

@Table({tableName: 'observation', timestamps: false})
export class Observation extends Model<Observation> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id!: number;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    created_at!: Date;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    status!: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false,
    })
    gps_lat!: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false,
    })
    gps_long!: number;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    description!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    type!: number;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    action_at?: Date;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    created_by!: number;

    @BelongsTo(() => User)
    user!: User;
}


//properties required to create a new observation
export interface IObservationRequest {
    description: string;
    type: string;
    latitude: number;
    longitude: number;
}

//properties required to update existing observation
export interface IObservationUpdateRequest extends IObservationRequest {
    id: number;
}

//properties returned by the database/service/controller after an observation is created/exists
export interface IObservationResponse {
    id: number;
    description: string;
    type: string;
    latitude: number;
    longitude: number;
    createdAt: Date;
    status: string;
    actionAt: Date | null;
    createdBy: number;
}

export class ObservationResponse implements IObservationResponse {
    id: number;
    description: string;
    type: string;
    latitude: number;
    longitude: number;
    createdAt: Date;
    status: string;
    actionAt: Date | null;
    createdBy: number;

    constructor(id: number, description: string, type: string, latitude: number, longitude: number,
                createdAt: Date, status: string, actionAt: Date | null, createdBy: number) {
        this.id = id;
        this.description = description;
        this.type = type;
        this.latitude = latitude;
        this.longitude = longitude;
        this.createdAt = createdAt;
        this.status = status;
        this.actionAt = actionAt;
        this.createdBy = createdBy;
    }
}