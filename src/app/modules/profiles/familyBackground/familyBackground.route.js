import express from "express";
import { FamilyBackgroundController } from "./familyBackground.controller.js";
import { Role } from "../../../utils/role.js";
import { checkAuthMiddleware } from "../../../middleware/checkAuthMiddleware.js";

const router = express.Router();

router.post(
    "/",
    checkAuthMiddleware(...Object.values(Role)),
    FamilyBackgroundController.upsertFamilyBackground
);

router.get(
    "/:userProfileId",
    checkAuthMiddleware(...Object.values(Role)),
    FamilyBackgroundController.getFamilyBackground
);

export const FamilyBackgroundRoutes = router;
