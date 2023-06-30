//properties required to create a new observation
export interface IObservationRequest {
    description: string;
    type: string;
    latitude: number;
    longitude: number;
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

    constructor(id: number, description: string, type: string, latitude: number, longitude: number,
                createdAt: Date, status: string, actionAt: Date | null) {
        this.id = id;
        this.description = description;
        this.type = type;
        this.latitude = latitude;
        this.longitude = longitude;
        this.createdAt = createdAt;
        this.status = status;
        this.actionAt = actionAt;
    }
}