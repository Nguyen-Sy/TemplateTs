import type { StringValue } from "ms";

import { NodeEnv } from "@shared/enums";
import * as dotenv from "dotenv";
import joi from "joi";

dotenv.config();

export interface Config {
    jwt: {
        accessTokenExpiresIn: StringValue;
        accessTokenSecretKey: string;
        refreshTokenExpiresIn: StringValue;
        refreshTokenSecretKey: string;
    };
    nodeEnv: NodeEnv;
    port: number;
    redis: {
        db: number;
        host: string;
        password?: string;
        port: number;
        username?: string;
    };
}

const envSchema = joi.object({
    jwt: joi.object({
        accessTokenExpiresIn: joi.string().default("1h"),
        accessTokenSecretKey: joi.string().required(),
        refreshTokenExpiresIn: joi.string().default("7d"),
        refreshTokenSecretKey: joi.string().required(),
    }),
    mongo: joi.object({
        uri: joi.string().required(),
    }),
    nodeEnv: joi
        .string()
        .valid(NodeEnv.DEV, NodeEnv.STAG, NodeEnv.PROD)
        .default(NodeEnv.DEV),
    port: joi.number().default(3000),
    redis: joi.object({
        db: joi.number().default(0),
        host: joi.string().default("localhost"),
        password: joi.string().optional(),
        port: joi.number().default(6379),
        username: joi.string().optional(),
    }),
});

const initConfig = () => {
    const { error, value: env } = envSchema.validate(
        {
            jwt: {
                accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
                accessTokenSecretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
                refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
                refreshTokenSecretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
            },
            mongo: {
                uri: process.env.MONGO_URI,
            },
            nodeEnv: process.env.NODE_ENV,
            port: process.env.PORT,
            redis: {
                db: process.env.REDIS_DB,
                host: process.env.REDIS_HOST,
                password: process.env.REDIS_PASSWORD,
                port: process.env.REDIS_PORT,
                username: process.env.REDIS_USERNAME,
            },
        },
        {
            abortEarly: false,
            convert: true,
        },
    );

    if (error) {
        throw new Error(`Invalid environment variables: ${error.message}`);
    }
    return env as Config;
};

const config = initConfig();
export default config;
