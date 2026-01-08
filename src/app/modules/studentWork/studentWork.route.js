import express from "express";
import { checkAuthMiddleware } from "../../middleware/checkAuthMiddleware.js";
import { Role } from "../../utils/role.js";
import { StudentWorkController } from "./studentWork.controller.js";


const router = express.Router();

router.post(
    "/",
    checkAuthMiddleware(...Object.values(Role)),
    StudentWorkController.createWork
);

router.get(
    "/:userProfileId",
    checkAuthMiddleware(...Object.values(Role)),
    StudentWorkController.getWorkExperiences
);

router.put(
    "/:id",
    checkAuthMiddleware(...Object.values(Role)),
    StudentWorkController.updateWork
);

router.delete(
    "/:id",
    checkAuthMiddleware(...Object.values(Role)),
    StudentWorkController.deleteWork
);

export const StudentWorkRoutes = router;
