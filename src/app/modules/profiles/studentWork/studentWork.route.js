import express from "express";
import { StudentWorkController } from "./studentWork.controller.js";
import { checkAuth } from "../../../middleware/authMiddleware.js";
import { Role } from "../../../utils/role.js";

const router = express.Router();

router.post(
    "/",
    checkAuth(...Object.values(Role)),
    StudentWorkController.createWork
);

router.get(
    "/:userProfileId",
    checkAuth(...Object.values(Role)),
    StudentWorkController.getWorkExperiences
);

router.put(
    "/:id",
    checkAuth(...Object.values(Role)),
    StudentWorkController.updateWork
);

router.delete(
    "/:id",
    checkAuth(...Object.values(Role)),
    StudentWorkController.deleteWork
);

export const StudentWorkRoutes = router;
