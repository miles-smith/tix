import express from "express";
import { RoutingError } from "@elevenhotdogs-tix/common";
import { paymentsRouter } from "./payments/router";

const router = express.Router();

router.use('/payments', paymentsRouter);

router.all('*', () => {
  throw new RoutingError();
});

export default router;
