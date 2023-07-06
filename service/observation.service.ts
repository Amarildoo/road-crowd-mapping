import logger from '../util/logger';
import {
    IObservationRequest,
    IObservationResponse,
    IObservationUpdateRequest,
    Observation,
    ObservationResponse
} from "../model/observation.model";
import {ObsStatus} from "../model/ObservationStatus";
import {getValidEnumValue} from "../util/enum.util";
import {ObsType} from "../model/ObservationType";

export async function createObservation(observationRequest: IObservationRequest, userId: number)
    : Promise<IObservationResponse> {
    logger.info("creating observation:" + JSON.stringify(observationRequest));

    let obs = new Observation();
    obs.created_at = new Date();
    obs.created_by = userId;
    obs.description = observationRequest.description;
    obs.status = ObsStatus.PENDING;
    let obsEnumVal = getValidEnumValue(observationRequest.type, ObsType);
    if (!obsEnumVal) {
        throw Error("Invalid Observation Type");
    }
    obs.type = parseInt(obsEnumVal);
    obs.gps_lat = observationRequest.latitude;
    obs.gps_long = observationRequest.longitude;
    obs.action_at = undefined;

    logger.debug("created observation:" + JSON.stringify(obs));
    await obs.save();

    return new ObservationResponse(obs);
}

export function getAllByStatus(reqStatusEnum: ObsStatus): Promise<Observation[]> {
    return Observation.findAll({
        where: {status: reqStatusEnum}
    });
}

export function getObsByType(type: ObsType): Promise<Observation[]> {
    return Observation.findAll({
        where: {type: type}
    });
}

export function getObsByTypeAndUser(type: ObsType, userId: number): Promise<Observation[]> {
    return Observation.findAll({
        where: {
            type: type,
            created_by: userId
        }
    });
}

export function getByStatusAndUserId(reqStatusEnum: ObsStatus, userId: number): Promise<Observation[]> {
    return Observation.findAll({
        where: {
            status: reqStatusEnum,
            created_by: userId
        }
    });
}

export function getObservationsByUserId(userId: number): Promise<Observation[]> {
    return Observation.findAll({
        where: {
            created_by: userId
        }
    });
}

export function getByObsIdAndUserId(obsId: number, userId: number): Promise<Observation | null> {
    return Observation.findOne({
        where: {
            created_by: userId,
            id: obsId
        }
    });
}

export async function updateObservationByUserId(request: IObservationUpdateRequest, userId: number): Promise<void> {
    logger.info("updating observation:" + JSON.stringify(request));
    //get obs in DB by id and creator id
    const obsList = await Observation.findAll({
        where: {
            id: request.id,
            created_by: userId
        }
    });
    //if not found
    if (obsList.length == 0) {
        throw Error("Observation not found");
    }
    const obsFound = obsList[0];
    obsFound.status = ObsStatus.PENDING; //set status as Pending (task requirement)
    obsFound.description = request.description;
    let obsEnumVal = getValidEnumValue(request.type, ObsType);
    if (!obsEnumVal) {
        throw Error("Invalid Observation Type");
    }
    obsFound.type = parseInt(obsEnumVal);
    obsFound.gps_lat = request.latitude;
    obsFound.gps_long = request.longitude;
    await obsFound.save();
}

export async function deleteObsById(id: number) {
    logger.info("deleting user by id: " + id);
    try {
        const deletedRows: number = await Observation.destroy({
            where: {
                id: id,
            },
        });
        return deletedRows; // Return the number of deleted rows
    } catch (error) {
        logger.error("error deleting user by id: " + id);
        throw error; // or return an appropriate value
    }
}

export async function deleteByIdAndUserId(obsId: number, userId: number) {
    logger.info("user id: " + userId + " deleting obs id: " + obsId);
    try {
        const deletedRows: number = await Observation.destroy({
            where: {
                id: obsId,
                created_by: userId,
            },
        });
        return deletedRows; // Return the number of deleted rows
    } catch (error) {
        logger.error("error deleting obs by id: " + obsId);
        throw error; // or return an appropriate value
    }
}

export async function rejectAllByUser(userId: number): Promise<void> {
    let condition;
    if (process.env.ALLOW_OBS_VERDICT_CHANGE !== "true") {
        condition = {
            created_by: userId,
            status: ObsStatus.PENDING
        }
    } else {
        condition = {
            created_by: userId,
        }
    }

    try {
        await Observation.update({
                status: ObsStatus.REJECTED,
                action_at: new Date()
            },
            {where: condition});
    } catch (e) {
        logger.error("error approving all observations by user id: " + userId);
        throw e;
    }
}

export async function approveAllByUser(userId: number): Promise<void> {
    let condition;
    if (process.env.ALLOW_OBS_VERDICT_CHANGE !== "true") {
        condition = {
            created_by: userId,
            status: ObsStatus.PENDING
        }
    } else {
        condition = {
            created_by: userId,
        }
    }

    try {
        await Observation.update({
                status: ObsStatus.ACCEPTED,
                action_at: new Date()
            },
            {
                where: condition
            });
    } catch (e) {
        logger.error("error approving all observations by user id: " + userId);
        throw e;
    }
}

export async function approveAllByType(obsType: ObsType): Promise<void> {
    let condition;
    if (process.env.ALLOW_OBS_VERDICT_CHANGE !== "true") {
        condition = {
            type: obsType,
            status: ObsStatus.PENDING
        }
    } else {
        condition = {
            type: obsType,
        }
    }

    try {
        await Observation.update({
                status: ObsStatus.ACCEPTED,
                action_at: new Date()
            },
            {
                where: condition
            });
    } catch (e) {
        logger.error("error approving all observations by type: " + obsType);
        throw e;
    }
}

export async function approveObservation(obsId: number): Promise<void> {
    try {

        if (process.env.ALLOW_OBS_VERDICT_CHANGE !== "true") {
            //check if obs exists and has not been approved yet
            const obsFound = await Observation.findOne({
                where: {
                    id: obsId,
                    status: ObsStatus.PENDING
                }
            });
            if (!obsFound)
                throw Error("Observation not found or already assigned a verdict!");
        }

        await Observation.update({
                status: ObsStatus.ACCEPTED,
                action_at: new Date()
            },
            {
                where: {
                    id: obsId,
                }
            });
    } catch (e) {
        logger.error("error approving obs id: " + obsId);
        throw e;
    }
}

export async function rejectObservation(obsId: number): Promise<void> {
    try {

        if (process.env.ALLOW_OBS_VERDICT_CHANGE !== "true") {
            //check if obs exists and has not been approved yet
            const obsFound = await Observation.findOne({
                where: {
                    id: obsId,
                    status: ObsStatus.PENDING
                }
            });
            if (!obsFound)
                throw Error("Observation not found or already assigned a verdict!");
        }

        //set status as rejected and update timestamp
        await Observation.update({
                status: ObsStatus.REJECTED.valueOf(),
                action_at: new Date()
            },
            {
                where: {
                    id: obsId,
                }
            });
    } catch (e) {
        logger.error("error rejecting obs id: " + obsId);
        throw e;
    }
}