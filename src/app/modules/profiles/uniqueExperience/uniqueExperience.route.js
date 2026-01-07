import express from "express";
import { UniqueExperienceController } from "./uniqueExperience.controller.js";
import { Role } from "../../../utils/role.js";
import { checkAuthMiddleware } from "../../../middleware/checkAuthMiddleware.js";

const router = express.Router();

router.post(
    "/",
    checkAuthMiddleware(...Object.values(Role)),
    UniqueExperienceController.upsertUniqueExperience
);

router.get(
    "/:userProfileId",
    checkAuthMiddleware(...Object.values(Role)),
    UniqueExperienceController.getUniqueExperience
);

export const UniqueExperienceRoutes = router;
