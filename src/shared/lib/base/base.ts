import { Logger } from "winston";

import { AppContext } from "../context";
import appLogger from "../logger";

export abstract class Base {
    protected readonly logger: Logger;

    constructor() {
        this.logger = appLogger.child({
            source: this.constructor.name,
        });
    }

    protected logError<T = Error>(context: AppContext, error: T) {
        if (error instanceof Error) {
            this.logger.error({
                context,
                message: error.message,
                stack: error.stack,
            });
        } else {
            this.logger.error(error);
        }
    }
}
