import express from "express";
import { EssayController } from "./essay.controller.js";
import { Role } from "../../utils/role.js";
import { checkAuthMiddleware } from "../../middleware/checkAuthMiddleware.js";

const router = express.Router();

// Narrative routes
router.post(
    "/narrative",
    checkAuthMiddleware(...Object.values(Role)),
    EssayController.upsertNarrative
);

router.get(
    "/narrative/:userProfileId",
    checkAuthMiddleware(...Object.values(Role)),
    EssayController.getNarrative
);

// Individual essay routes
router.post(
    "/",
    checkAuthMiddleware(...Object.values(Role)),
    EssayController.createEssay
);

router.get(
    "/:userProfileId",
    checkAuthMiddleware(...Object.values(Role)),
    EssayController.getEssays
);

router.put(
    "/:id",
    checkAuthMiddleware(...Object.values(Role)),
    EssayController.updateEssay
);

router.delete(
    "/:id",
    checkAuthMiddleware(...Object.values(Role)),
    EssayController.deleteEssay
);

export const EssayRoutes = router;
