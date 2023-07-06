import {Model, Table, Column, DataType, ForeignKey, BelongsTo} from 'sequelize-typescript';
import {User} from './user.model';
import {getEnumKeyFromValue} from "../util/enum.util";
import {ObsType} from "./ObservationType";
import {ObsStatus} from "./ObservationStatus";
import dayjs from "dayjs";

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
    createdAt: string;
    status: string;
    actionAt: string | null;
    createdBy: number;
}

export class ObservationResponse implements IObservationResponse {
    id: number;
    description: string;
    type: string;
    latitude: number;
    longitude: number;
    createdAt: string;
    status: string;
    actionAt: string | null;
    createdBy: number;

    constructor(observation: Observation) {
        this.id = observation.id;
        this.description = observation.description;
        this.type = getEnumKeyFromValue(observation.type, ObsType) || "";
        this.latitude = observation.gps_lat;
        this.longitude = observation.gps_long;
        this.status = getEnumKeyFromValue(observation.status, ObsStatus) || "";
        this.createdBy = observation.created_by;

        if (observation.action_at)
            this.actionAt = dayjs(observation.action_at).format("DD-MM-YYYY HH:mm:ss");
        else this.actionAt = null;
        this.createdAt = dayjs(observation.createdAt).format("DD-MM-YYYY HH:mm:ss");
    }

}