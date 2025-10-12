import appRedis from "@domain/db/redis";
import Redis from "ioredis";
import { Logger } from "winston";

import appLogger from "../logger";

export abstract class BaseService {
    protected readonly logger: Logger;
    protected readonly redis: Redis = appRedis;

    constructor() {
        this.logger = appLogger.child({
            source: this.constructor.name,
        });
    }
}
