import config from "@config/index";
import appLogger from "@shared/lib/logger";
import Redis, { RedisOptions } from "ioredis";

class RedisClient {
    private static instance: null | Redis = null;
    private constructor() {}

    public static async disconnect(): Promise<void> {
        if (RedisClient.instance) {
            await RedisClient.instance.quit();
            RedisClient.instance = null;
        }
    }

    public static getInstance(options?: RedisOptions): Redis {
        if (!RedisClient.instance) {
            const defaultOptions: RedisOptions = {
                db: config.redis.db,
                host: config.redis.host,
                maxRetriesPerRequest: 3,
                password: config.redis.password,
                port: config.redis.port,
                retryStrategy: (times: number) => {
                    const delay = Math.min(times * 50, 2000);
                    return delay;
                },
                username: config.redis.username,
            };

            const redisOptions = { ...defaultOptions, ...options };
            RedisClient.instance = new Redis(redisOptions);

            RedisClient.instance.on("connect", () => {
                appLogger.info("Redis connected successfully");
            });

            RedisClient.instance.on("error", (err: Error) => {
                appLogger.error(err);
            });

            RedisClient.instance.on("close", () => {
                appLogger.info("Redis connection closed");
            });
        }

        return RedisClient.instance;
    }

    public static isConnected(): boolean {
        return (
            RedisClient.instance !== null &&
            RedisClient.instance.status === "ready"
        );
    }
}

const appRedis = RedisClient.getInstance();
export default appRedis;
