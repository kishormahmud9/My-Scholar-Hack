import express from "express";
import { BasicInformationController } from "./basicInformation.controller.js";
import { checkAuth } from "../../../middleware/authMiddleware.js";
import { Role } from "../../../utils/role.js";

const router = express.Router();

router.post(
  "/basic-information/create",
  checkAuth(Role.STUDENT),
  BasicInformationController.upsert
);

router.get(
  "/basic-information",
  checkAuth(Role.STUDENT),
  BasicInformationController.getMe
);

router.put(
  "/basic-information/update",
  checkAuth(Role.STUDENT),
  BasicInformationController.update
);

export const BasicInformationRoutes = router;
