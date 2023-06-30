import logger from '../util/logger';
import {IObservationRequest, IObservationResponse, ObservationResponse} from "../model/observation.model";

export function createObservation(observationRequest: IObservationRequest): IObservationResponse | undefined {
    try {
        logger.info("creating observation:" + JSON.stringify(observationRequest));
        //todo: insert observation to db

        //todo: get ID from DB insert
        let res = new ObservationResponse(1, observationRequest.description,
            observationRequest.type, observationRequest.latitude, observationRequest.longitude,
            new Date(), "pending", null);

        return res;
    } catch (e: any) {
        logger.error(e);
        return undefined;
    }
}

//todo; set parameter as Enum if Typescript supports it
export function getAllByStatus(status: string): Array<IObservationResponse> {
    //todo: get all users from db
    return [];
}

export function updateObservation(): void {
    //todo: get obs from DB, check if logged user is Admin or the owner (thr exp if not), update in db
}

export async function deleteById(id: number) {
    //todo: get obs from DB, check if logged user is Admin or the owner (thr exp if not), delete in db
}

export function approveAllByUser(userId: number) : void {
    //update all observations of where created_by = :userId (set status, and action_date)
}

export function approveAllByType(obsType: string) : void {
    //update all observations of where type= :obsType (set status, and action_date)
}

export function approveObservation(obsId: number) : void {

}

export function rejectObservation(obsId: number) : void {

}