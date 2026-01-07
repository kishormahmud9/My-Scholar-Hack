import express from "express";
import { ExtracurricularActivityController } from "./extraCurricularActivities.controller.js";
import { Role } from "../../../utils/role.js";
import { checkAuthMiddleware } from "../../../middleware/checkAuthMiddleware.js";


const router = express.Router();

router.get(
  "/",
  checkAuthMiddleware(Role.STUDENT),
  ExtracurricularActivityController.getExtracurricularActivity
);

router.post(
  "/create",
  checkAuthMiddleware(Role.STUDENT),
  ExtracurricularActivityController.createExtracurricularActivity
);

router.put(
  "/update",
  checkAuthMiddleware(Role.STUDENT),
  ExtracurricularActivityController.updateExtracurricularActivity
);

export const ExtracurricularActivityRoutes = router;
