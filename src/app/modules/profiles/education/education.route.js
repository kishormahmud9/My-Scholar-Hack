import express from "express";
import { EducationController } from "./education.controller.js";
import { Role } from "../../../utils/role.js";
import { checkAuthMiddleware } from "../../../middleware/checkAuthMiddleware.js";

const router = express.Router();

router.post(
    "/",
    checkAuthMiddleware(...Object.values(Role)),
    EducationController.createEducation
);

router.get(
    "/:userProfileId",
    checkAuthMiddleware(...Object.values(Role)),
    EducationController.getEducations
);

router.put(
    "/:id",
    checkAuthMiddleware(...Object.values(Role)),
    EducationController.updateEducation
);

router.delete(
    "/:id",
    checkAuthMiddleware(...Object.values(Role)),
    EducationController.deleteEducation
);

export const EducationRoutes = router;
