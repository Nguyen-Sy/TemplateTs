import { Request } from "express";
import lodash from "lodash";

import { JwtPayload } from "../jwt";

export type AppContext = {
    jwtPayload?: JwtPayload;
    requestId: string;
};

export const extractContext = (req: Request): AppContext => {
    return {
        jwtPayload: lodash.get(req, "user"),
        requestId: req.headers["x-request-id"] as string,
    };
};
