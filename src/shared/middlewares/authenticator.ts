import { requestContextStorage } from "@shared/lib/context";
import { UnauthorizedError } from "@shared/lib/http/httpError";
import jwt, { JwtTokenType, TokenTypes } from "@shared/lib/jwt";
import { NextFunction, Request, Response } from "express";

export const authenticator = (type: TokenTypes) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) return next(new UnauthorizedError());

        const isOptional = type.endsWith("-optional");
        const tokenType = type.split("-")[0] as JwtTokenType;
        const token = authorizationHeader.split(" ")[1];

        if (!token) {
            if (isOptional) return next();
        } else {
            return next(new UnauthorizedError());
        }

        const jwtPayload = jwt.verifyToken(token, tokenType);
        if (!jwtPayload) return next(new UnauthorizedError());

        requestContextStorage.enterWith({
            jwtPayload,
            requestId: req.headers["x-request-id"] as string,
        });
        next();
    };
};
