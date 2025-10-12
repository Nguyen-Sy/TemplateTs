import { NodeEnv } from "@shared/constant";
import * as dotenv from "dotenv";
import joi from "joi";
import type { StringValue } from "ms";

dotenv.config();

export interface Config {
    port: number;
    nodeEnv: NodeEnv;
    jwt: {
        accessTokenSecretKey: string;
        accessTokenExpiresIn: StringValue;
        refreshTokenSecretKey: string;
        refreshTokenExpiresIn: StringValue;
    };
}

const envSchema = joi.object({
    port: joi.number().default(3000),
    nodeEnv: joi
        .string()
        .valid(NodeEnv.DEV, NodeEnv.STAG, NodeEnv.PROD)
        .default(NodeEnv.DEV),

    jwt: joi.object({
        accessTokenSecretKey: joi.string().required(),
        accessTokenExpiresIn: joi.string().default("1h"),
        refreshTokenSecretKey: joi.string().required(),
        refreshTokenExpiresIn: joi.string().default("7d"),
    }),
});

const initConfig = () => {
    const { error, value: env } = envSchema.validate(
        {
            port: process.env.PORT,
            nodeEnv: process.env.NODE_ENV,
            jwt: {
                accessTokenSecretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
                accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
                refreshTokenSecretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
                refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
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
