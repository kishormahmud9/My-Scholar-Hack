import express from "express";
import { EssayController } from "./essay.controller.js";
import { checkAuth } from "../../middleware/authMiddleware.js";
import { Role } from "../../utils/role.js";

const router = express.Router();

// Narrative routes
router.post(
    "/narrative",
    checkAuth(...Object.values(Role)),
    EssayController.upsertNarrative
);

router.get(
    "/narrative/:userProfileId",
    checkAuth(...Object.values(Role)),
    EssayController.getNarrative
);

// Individual essay routes
router.post(
    "/",
    checkAuth(...Object.values(Role)),
    EssayController.createEssay
);

router.get(
    "/:userProfileId",
    checkAuth(...Object.values(Role)),
    EssayController.getEssays
);

router.put(
    "/:id",
    checkAuth(...Object.values(Role)),
    EssayController.updateEssay
);

router.delete(
    "/:id",
    checkAuth(...Object.values(Role)),
    EssayController.deleteEssay
);

export const EssayRoutes = router;
