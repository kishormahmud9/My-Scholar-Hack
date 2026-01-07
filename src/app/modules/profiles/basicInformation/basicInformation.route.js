import express from "express";
import { BasicInformationController } from "./basicInformation.controller.js";

import { Role } from "../../../utils/role.js";
import { checkAuthMiddleware } from "../../../middleware/checkAuthMiddleware.js";

const router = express.Router();

router.post(
  "/create",
  checkAuthMiddleware(Role.STUDENT),
  BasicInformationController.upsert
);

router.get(
  "/",
  checkAuthMiddleware(Role.STUDENT),
  BasicInformationController.getMe
);

router.put(
  "/update",
  checkAuthMiddleware(Role.STUDENT),
  BasicInformationController.update
);

export const BasicInformationRoutes = router;
