import express from "express";

import healthCheckRouter from "./healthCheck/healthCheck.router";
import userRouter from "./user/user.router";

const routerV1 = express.Router();
routerV1.use("/health_check", healthCheckRouter);
routerV1.use("/user", userRouter);

const router = express.Router();
router.use("/v1", routerV1);

export default router;
