import * as dotenv from "dotenv";
import { NodeEnv } from "src/shared/constant/config";

dotenv.config();

interface Config {
    port: number;
    nodeEnv: NodeEnv;
    writeLogFile: boolean;
}

const config: Config = {
    port: Number(process.env.port ?? "3000"),
    nodeEnv: (process.env.NODE_ENV as NodeEnv) ?? NodeEnv.DEV,
    writeLogFile: process.env.NODE_ENV !== "DEV",
};

export default config;
