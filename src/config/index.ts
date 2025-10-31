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
}

const envSchema = joi.object({
    jwt: joi.object({
        accessTokenExpiresIn: joi.string().default("1h"),
        accessTokenSecretKey: joi.string().required(),
        refreshTokenExpiresIn: joi.string().default("7d"),
        refreshTokenSecretKey: joi.string().required(),
    }),
    nodeEnv: joi
        .string()
        .valid(NodeEnv.DEV, NodeEnv.STAG, NodeEnv.PROD)
        .default(NodeEnv.DEV),

    port: joi.number().default(3000),
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
            nodeEnv: process.env.NODE_ENV,
            port: process.env.PORT,
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
