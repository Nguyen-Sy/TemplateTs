import config from "@config/index";
import { NodeEnv } from "@shared/enums";
import { createLogger, format, transports } from "winston";

import { AppContext } from "../context";

const initDevFormat = () => {
    return format.printf(
        ({ level, message, requestId, source, stack, timestamp, userId }) => {
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
    );
};

const initProdFormat = () => {
    return format.json();
};

const initBaseFormat = () => {
    const formats = [
        format((info) => {
            const { context, level, message, source, stack, timestamp } = info;
            const result: Record<string, unknown> = {
                level,
                message,
                source,
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
    ];
    return formats;
};

const initErrorStackFormat = () => {
    return [format.errors({ stack: true })];
};

const initLogger = (env: NodeEnv) => {
    const baseFormat = initBaseFormat();
    const errorFormat = initErrorStackFormat();
    const formats = [
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        ...errorFormat,
        ...baseFormat,
    ];

    if (env === NodeEnv.DEV) {
        formats.unshift(format.colorize());
        formats.push(initDevFormat());
    } else {
        formats.push(initProdFormat());
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
