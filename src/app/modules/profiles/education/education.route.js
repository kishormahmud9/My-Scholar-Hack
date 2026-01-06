import express from "express";
import { EducationController } from "./education.controller.js";
import { checkAuth } from "../../../middleware/authMiddleware.js";
import { Role } from "../../../utils/role.js";

const router = express.Router();

router.post(
    "/",
    checkAuth(...Object.values(Role)),
    EducationController.createEducation
);

router.get(
    "/:userProfileId",
    checkAuth(...Object.values(Role)),
    EducationController.getEducations
);

router.put(
    "/:id",
    checkAuth(...Object.values(Role)),
    EducationController.updateEducation
);

router.delete(
    "/:id",
    checkAuth(...Object.values(Role)),
    EducationController.deleteEducation
);

export const EducationRoutes = router;
