import express from "express";
import { checkAuthMiddleware } from "../../middleware/checkAuthMiddleware.js";
import { Role } from "../../utils/role.js";
import { StudentActivityController } from "./studentActivity.controller.js";


const router = express.Router();

router.post(
    "/",
    checkAuthMiddleware(...Object.values(Role)),
    StudentActivityController.createActivity
);

router.get(
    "/:userProfileId",
    checkAuthMiddleware(...Object.values(Role)),
    StudentActivityController.getActivities
);

router.put(
    "/:id",
    checkAuthMiddleware(...Object.values(Role)),
    StudentActivityController.updateActivity
);

router.delete(
    "/:id",
    checkAuthMiddleware(...Object.values(Role)),
    StudentActivityController.deleteActivity
);

export const StudentActivityRoutes = router;
