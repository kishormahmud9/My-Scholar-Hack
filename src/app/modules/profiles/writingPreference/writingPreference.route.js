import express from "express";
import { WritingPreferenceController } from "./writingPreference.controller.js";
import { checkAuth } from "../../../middleware/authMiddleware.js";
import { Role } from "../../../utils/role.js";

const router = express.Router();

router.post(
    "/",
    checkAuth(...Object.values(Role)),
    WritingPreferenceController.upsertWritingPreference
);

router.get(
    "/:userProfileId",
    checkAuth(...Object.values(Role)),
    WritingPreferenceController.getWritingPreference
);

export const WritingPreferenceRoutes = router;
