import express from "express";
import { checkAuth } from "../../../middleware/authMiddleware.js";
import { ExtracurricularActivityController } from "./extraCurricularActivities.controller.js";
import { Role } from "../../../utils/role.js";


const router = express.Router();

router.get(
  "/",
  checkAuth(Role.STUDENT),
  ExtracurricularActivityController.getExtracurricularActivity
);

router.post(
  "/create",
  checkAuth(Role.STUDENT),
  ExtracurricularActivityController.createExtracurricularActivity
);

router.put(
  "/update",
  checkAuth(Role.STUDENT),
  ExtracurricularActivityController.updateExtracurricularActivity
);

export const ExtracurricularActivityRoutes = router;
