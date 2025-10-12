import config from "@config/index";
import { NodeEnv } from "@shared/constant";
import { createLogger, format, transports } from "winston";

import { AppContext } from "../context";

const initFormat = () => {
    const formats = [
        format((info) => {
            const { context, level, message, timestamp, source, stack } = info;
            const result: Record<string, unknown> = {
                level,
                source,
                message,
                timestamp,
            };
            if (context) {
                const { jwtPayload, requestId } = context as AppContext;
                if (jwtPayload) {
                    result.userId = jwtPayload.userId;
                }
                if (requestId) {
                    result.requestId = requestId;
                }
            }
            if (stack) {
                result.stack = stack;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return result as any;
        })(),
        format.printf(
            ({
                level,
                source,
                message,
                timestamp,
                userId,
                requestId,
                stack,
            }) => {
                let messageString = `${level}: [${timestamp}]\nSource: ${source}\nMessage: ${message}\n`;
                if (userId) {
                    messageString += `User ID: ${userId as string}\n`;
                }
                if (requestId) {
                    messageString += `Request ID: ${requestId as string}\n`;
                }
                if (stack) {
                    messageString += `Stack: ${stack as string}\n`;
                }
                return messageString;
            },
        ),
    ];
    return formats;
};

const initErrorStackFormat = () => {
    return [format.errors({ stack: true })];
};

const initLogger = (env: NodeEnv) => {
    const customFormat = initFormat();
    const errorFormat = initErrorStackFormat();
    const formats = [
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        ...errorFormat,
        ...customFormat,
    ];

    if (env === NodeEnv.DEV) {
        formats.unshift(format.colorize());
    } else {
        formats.pop();
        formats.push(format.json());
    }

    const logger = createLogger({
        level: env === NodeEnv.DEV ? "debug" : "info",
        transports: [
            new transports.Console({
                format: format.combine(...formats),
            }),
        ],
    });
    return logger.child({
        source: "app",
    });
};

const appLogger = initLogger(config.nodeEnv);
export default appLogger;
