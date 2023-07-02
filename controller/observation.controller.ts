import {Request, Response} from "express";
import logger from "../util/logger";
import {
    approveAllByType, approveAllByUser,
    approveObservation,
    createObservation,
    deleteByIdAndUserId,
    deleteObsById,
    getAllByStatus, getObsByType,
    getByStatusAndUserId,
    rejectAllByUser,
    rejectObservation,
    updateObservationByUserId, getObsByTypeAndUser
} from "../service/observation.service";
import {getValidEnumValue} from "../util/enum.util";
import {ObsType} from "../model/ObservationType";
import {ObsStatus} from "../model/ObservationStatus";
import {ObservationResponse} from "../model/observation.model";

export async function createObservationHandler(req: Request, res: Response) {
    const obsRequest = req.body;

    //validate if type is part of enum list
    const enumVal = getValidEnumValue(obsRequest.type, ObsType);
    if (!enumVal) {
        logger.warn("observation type doesn't exist: ", obsRequest.type)
        return res.status(400)
            .json({message: 'Observation type not valid'})
            .send();
    }

    try {
        const obs = await createObservation(obsRequest, req.currentUser.id);
        res.status(201) //created
            .send(obs);
    } catch (e: any) {
        logger.error(e);
        return res.status(500)
            .json({message: 'Oops! Error: ' + e.message})
            .send();
    }
}

export async function updateObservationHandler(req: Request, res: Response) {
    const obsRequest = req.body;

    //validate if type is part of enum list
    const enumVal = getValidEnumValue(obsRequest.type, ObsType);
    if (!enumVal) {
        logger.warn("observation type doesn't exist: ", obsRequest.type)
        return res.status(400)
            .json({message: 'Observation type not valid'})
            .send();
    }

    try {
        await updateObservationByUserId(obsRequest, req.currentUser.id);
        res.status(200)
            .send();
    } catch (e: any) {
        return res.status(500)
            .json({message: 'Oops! Error: ' + e.message})
            .send();
    }
}

export async function getObservationsByStatusHandler(req: Request, res: Response) {
    const status: string = req.query.status!.toString();

    //validate if type is part of enum list
    const enumVal = getValidEnumValue(status, ObsStatus);
    if (!enumVal) {
        logger.info("Obs status doesn't exist: ", req.query.status)
        return res.status(400)
            .json({message: "Observation status not valid"})
            .send();
    }

    //if admin, filter all
    if (req.isAdmin) {
        logger.info("user is admin, getting all observations")
        await getAllByStatus(parseInt(enumVal))
            .then(obs => {
                const resList = obs.map(obs => new ObservationResponse(obs))
                res.status(200)
                    .send(resList);
            }).catch(e => {
                logger.error(e);
                return res.status(500)
                    .json({message: 'Oops! Error: ' + e.message})
                    .send();
            });
    } else { //else show only current user's
        await getByStatusAndUserId(parseInt(enumVal), req.currentUser.id)
            .then(obs => {
                const resList = obs.map(obs => new ObservationResponse(obs))
                res.status(200)
                    .send(resList);
            }).catch(e => {
                logger.error(e);
                return res.status(500)
                    .json({message: 'Oops! Error: ' + e.message})
                    .send();
            });
    }
}

export async function getObservationsByTypeHandler(req: Request, res: Response) {
    //validate if type is part of enum list
    const enumVal = getValidEnumValue(req.query.obsType!.toString(), ObsType);
    if (!enumVal) {
        logger.error("observation doesn't exist: ", req.query.obsType)
        return res.status(400)
            .json({message: 'Observation type not valid'})
            .send();
    }

    if (req.isAdmin) {
        await getObsByType(parseInt(enumVal)).then(obs => {
            const resList = obs.map(obs => new ObservationResponse(obs))
            res.status(200)
                .send(resList);
        }).catch(e => {
            logger.error(e);
            return res.status(500)
                .json({message: 'Oops! Error: ' + e.message})
                .send();
        });
    } else { //show only current user's
        await getObsByTypeAndUser(parseInt(enumVal), req.currentUser.id).then(obs => {
            const resList = obs.map(obs => new ObservationResponse(obs))
            res.status(200)
                .send(resList);
        }).catch(e => {
            logger.error(e);
            return res.status(500)
                .json({message: 'Oops! Error: ' + e.message})
                .send();
        });
    }
}

export async function deleteObservationByIdHandler(req: Request, res: Response) {
    //if admin, access all
    if (req.isAdmin) {
        logger.info("user is admin, deleting observation")
        const deletedRows = await deleteObsById(parseInt(req.params.obsId.toString()));
        if (deletedRows === 0) {
            logger.info('Observation not found: ', req.params.observationId);
            return res.status(404)
                .json({message: 'Observation not found'})
                .send();
        }
        return res.status(200)
            .send();
    } else { //else delete only if user created it himself
        const deletedRows = await deleteByIdAndUserId(parseInt(req.params.obsId), req.currentUser.id);
        if (deletedRows === 0) {
            logger.info('Observation not found: ', req.params.observationId);
            return res.status(404)
                .json({message: 'Observation not found'})
                .send();
        }
        return res.status(200)
            .send();
    }
}

export async function approveObsByIdHandler(req: Request, res: Response) {
    try {
        await approveObservation(parseInt(req.params.obsId.toString()));
        return res.status(200)
            .send();
    } catch (e: any) {
        return res.status(500)
            .json({message: 'Oops! Error: ' + e.message})
            .send();
    }
}

export async function rejectObsByIdHandler(req: Request, res: Response) {
    try {
        await rejectObservation(parseInt(req.params.obsId.toString()));
        return res.status(200)
            .send();
    } catch (e: any) {
        return res.status(500)
            .json({message: 'Oops! Error: ' + e.message})
            .send();
    }
}

export async function approveObsByUserHandler(req: Request, res: Response) {
    try {
        await approveAllByUser(parseInt(req.params.userId.toString()));
        return res.status(200)
            .send();
    } catch (e: any) {
        logger.error(e);
        return res.status(500)
            .json({message: 'Oops! Error: ' + e.message})
            .send();
    }
}

export async function rejectObsByUserHandler(req: Request, res: Response) {
    try {
        await rejectAllByUser(parseInt(req.params.userId.toString()));
        return res.status(200)
            .send();
    } catch (e: any) {
        logger.error(e);
        return res.status(500)
            .json({message: 'Oops! Error: ' + e.message})
            .send();
    }
}

export async function approveObsByTypeHandler(req: Request, res: Response) {
    logger.info("approveObsByTypeHandler: ", req.query.obsType)

    //validate if type is part of enum list
    const enumVal = getValidEnumValue(req.query.obsType!.toString(), ObsType);
    if (!enumVal) {
        logger.error("observation doesn't exist: ", req.query.obsType)
        return res.status(400)
            .json({message: 'Observation type not valid'})
            .send();
    }

    try {
        await approveAllByType(parseInt(enumVal));
        return res.status(200)
            .send();
    } catch (e: any) {
        return res.status(500)
            .json({message: 'Oops! Error: ' + e.message})
            .send();
    }
}

