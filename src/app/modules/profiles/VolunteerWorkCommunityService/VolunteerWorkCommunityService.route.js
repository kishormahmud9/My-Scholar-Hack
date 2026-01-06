import express from "express";
import { checkAuth } from "../../../middleware/authMiddleware.js";
import { VolunteerController } from "./VolunteerWorkCommunityService.controller.js";
import { Role } from "../../../utils/role.js";


const router = express.Router();

router.get(
  "/",
  checkAuth(Role.STUDENT),
  VolunteerController.getVolunteer
);

router.post(
  "/create",
  checkAuth(Role.STUDENT),
  VolunteerController.createVolunteer
);

router.put(
  "/update",
  checkAuth(Role.STUDENT),
  VolunteerController.updateVolunteer
);

export const VolunteerRoutes = router;
