import express from "express";
import { FamilyBackgroundController } from "./familyBackground.controller.js";
import { checkAuth } from "../../../middleware/authMiddleware.js";
import { Role } from "../../../utils/role.js";

const router = express.Router();

router.post(
    "/",
    checkAuth(...Object.values(Role)),
    FamilyBackgroundController.upsertFamilyBackground
);

router.get(
    "/:userProfileId",
    checkAuth(...Object.values(Role)),
    FamilyBackgroundController.getFamilyBackground
);

export const FamilyBackgroundRoutes = router;
