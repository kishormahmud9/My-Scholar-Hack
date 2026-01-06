import express from "express";
import { StudentActivityController } from "./studentActivity.controller.js";
import { checkAuth } from "../../../middleware/authMiddleware.js";
import { Role } from "../../../utils/role.js";

const router = express.Router();

router.post(
    "/",
    checkAuth(...Object.values(Role)),
    StudentActivityController.createActivity
);

router.get(
    "/:userProfileId",
    checkAuth(...Object.values(Role)),
    StudentActivityController.getActivities
);

router.put(
    "/:id",
    checkAuth(...Object.values(Role)),
    StudentActivityController.updateActivity
);

router.delete(
    "/:id",
    checkAuth(...Object.values(Role)),
    StudentActivityController.deleteActivity
);

export const StudentActivityRoutes = router;
