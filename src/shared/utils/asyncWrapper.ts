import { NextFunction, Request, Response } from "express";

type Func = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<unknown>;

export const asyncWrapper = (fn: Func) => {
    return (req: Request, res: Response, next: NextFunction) =>
        fn(req, res, next).catch((error) => {
            next(error);
        });
};
