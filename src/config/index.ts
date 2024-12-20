import { NodeEnv } from "@shared/constant";
import * as dotenv from "dotenv";

dotenv.config();

interface Config {
    port: number;
    nodeEnv: NodeEnv;
    writeLogFile: boolean;
}

const config: Config = {
    port: Number(process.env.PORT ?? "3000"),
    nodeEnv: (process.env.NODE_ENV as NodeEnv) ?? NodeEnv.DEV,
    writeLogFile: process.env.NODE_ENV !== "DEV",
};

export default config;
