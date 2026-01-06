import express from "express";
import { StudentVolunteerController } from "./studentVolunteer.controller.js";
import { checkAuth } from "../../../middleware/authMiddleware.js";
import { Role } from "../../../utils/role.js";

const router = express.Router();

router.post(
    "/",
    checkAuth(...Object.values(Role)),
    StudentVolunteerController.createVolunteer
);

router.get(
    "/:userProfileId",
    checkAuth(...Object.values(Role)),
    StudentVolunteerController.getVolunteerWorks
);

router.put(
    "/:id",
    checkAuth(...Object.values(Role)),
    StudentVolunteerController.updateVolunteer
);

router.delete(
    "/:id",
    checkAuth(...Object.values(Role)),
    StudentVolunteerController.deleteVolunteer
);

export const StudentVolunteerRoutes = router;
