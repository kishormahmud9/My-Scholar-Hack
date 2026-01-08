import express from "express";
import { checkAuthMiddleware } from "../../middleware/checkAuthMiddleware.js";
import { Role } from "../../utils/role.js";
import { WritingPreferenceController } from "./writingPreference.controller.js";


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
