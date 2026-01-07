import express from "express";
import { StudentVolunteerController } from "./studentVolunteer.controller.js";

import { Role } from "../../../utils/role.js";
import { checkAuthMiddleware } from "../../../middleware/checkAuthMiddleware.js";

const router = express.Router();

router.post(
    "/",
    checkAuthMiddleware(...Object.values(Role)),
    StudentVolunteerController.createVolunteer
);

router.get(
    "/:userProfileId",
    checkAuthMiddleware(...Object.values(Role)),
    StudentVolunteerController.getVolunteerWorks
);

router.put(
    "/:id",
    checkAuthMiddleware(...Object.values(Role)),
    StudentVolunteerController.updateVolunteer
);

router.delete(
    "/:id",
    checkAuthMiddleware(...Object.values(Role)),
    StudentVolunteerController.deleteVolunteer
);

export const StudentVolunteerRoutes = router;
