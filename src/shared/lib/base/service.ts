import appRedis from "@domain/db/redis";
import appRepos, { AppRepos } from "@domain/repo";
import Redis from "ioredis";

import { Base } from "./base";

export abstract class BaseService extends Base {
    protected readonly repos: AppRepos = appRepos;
}

export abstract class BaseServiceWithRedis extends BaseService {
    protected readonly redis: Redis = appRedis;
}
