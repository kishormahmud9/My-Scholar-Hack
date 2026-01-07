import express from "express";
import { VolunteerController } from "./VolunteerWorkCommunityService.controller.js";
import { Role } from "../../../utils/role.js";
import { checkAuthMiddleware } from "../../../middleware/checkAuthMiddleware.js";


const router = express.Router();

router.get(
  "/",
  checkAuthMiddleware(Role.STUDENT),
  VolunteerController.getVolunteer
);

router.post(
  "/create",
  checkAuthMiddleware(Role.STUDENT),
  VolunteerController.createVolunteer
);

router.put(
  "/update",
  checkAuthMiddleware(Role.STUDENT),
  VolunteerController.updateVolunteer
);

export const VolunteerRoutes = router;
