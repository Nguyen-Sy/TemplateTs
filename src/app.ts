import router from "@api/app.route";
import { handleError, handleNotFound } from "@shared/middlewares/errorHandler";
import { requestTracker } from "@shared/middlewares/requestTracker";
import express, { ErrorRequestHandler } from "express";
import morgan from "morgan";
import "@domain/db";

const app = express();

app.use(express.json());
app.use(requestTracker);

morgan.token("request-time", () => {
    return new Date().toISOString();
});

app.use(
    morgan(
        ":request-time :method :url :status :res[content-length] - :response-time ms",
    ),
);

app.use("/api/v1", router);
app.use(handleNotFound);

app.use(handleError as unknown as ErrorRequestHandler);

export default app;
