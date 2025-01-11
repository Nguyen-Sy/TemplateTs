import express from "express";

import healthCheckRouter from "./healthCheck/healthCheck.route";

const router = express.Router();

router.use("/health_check", healthCheckRouter);

export default router;
