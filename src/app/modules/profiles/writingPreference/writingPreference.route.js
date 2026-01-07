import express from "express";
import { WritingPreferenceController } from "./writingPreference.controller.js";
import { Role } from "../../../utils/role.js";
import { checkAuthMiddleware } from "../../../middleware/checkAuthMiddleware.js";

const router = express.Router();

router.post(
    "/",
    checkAuthMiddleware(...Object.values(Role)),
    WritingPreferenceController.upsertWritingPreference
);

router.get(
    "/:userProfileId",
    checkAuthMiddleware(...Object.values(Role)),
    WritingPreferenceController.getWritingPreference
);

export const WritingPreferenceRoutes = router;
