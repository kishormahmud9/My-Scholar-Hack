import express from "express";
import { UniqueExperienceController } from "./uniqueExperience.controller.js";
import { checkAuth } from "../../../middleware/authMiddleware.js";
import { Role } from "../../../utils/role.js";

const router = express.Router();

router.post(
    "/",
    checkAuth(...Object.values(Role)),
    UniqueExperienceController.upsertUniqueExperience
);

router.get(
    "/:userProfileId",
    checkAuth(...Object.values(Role)),
    UniqueExperienceController.getUniqueExperience
);

export const UniqueExperienceRoutes = router;
