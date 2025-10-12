import appRedis from "@domain/db/redis";
import appRepos, { AppRepos } from "@domain/repo";
import Redis from "ioredis";
import { Logger } from "winston";

import appLogger from "../logger";

export abstract class BaseService {
    protected readonly logger: Logger;
    protected readonly redis: Redis = appRedis;
    protected readonly repos: AppRepos = appRepos;

    constructor() {
        this.logger = appLogger.child({
            source: this.constructor.name,
        });
    }
}
