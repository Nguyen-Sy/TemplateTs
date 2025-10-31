import config from "@config/index";
import { NodeEnv } from "@shared/enums";
import logger from "@shared/lib/logger";
import { NextFunction, Request, Response } from "express";
import lodash from "lodash";
import { v4 as uuidV4 } from "uuid";

export const requestTracker = (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    req.headers["x-request-id"] = req.headers["x-request-id"] ?? uuidV4();
    const loggerFields = ["body", "params", "query"];
    if (config.nodeEnv === NodeEnv.DEV) {
        for (const field of loggerFields) {
            requestLogger(lodash.get(req, field), field);
        }
    }
    next();
};

const requestLogger = (reqField: null | object, fieldName: string) => {
    if (reqField && Object.keys(reqField).length > 0) {
        logger.debug({ field: fieldName, value: reqField });
    }
};
