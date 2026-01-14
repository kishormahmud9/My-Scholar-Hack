import express from "express";
import { checkAuthMiddleware } from "../../middleware/checkAuthMiddleware.js";
import { Role } from "../../utils/role.js";
import { EssayController } from "./generateEssay.controller.js";

const router = express.Router();

router.get(
  "/",
  checkAuthMiddleware(Role.STUDENT),
  EssayController.getEssays
);

router.get(
  "/:id",
  checkAuthMiddleware(Role.STUDENT),
  EssayController.getEssayById
);

router.post(
  "/generate",
  checkAuthMiddleware(Role.STUDENT),
  EssayController.createEssay
);

// EDIT essay anytime
router.patch(
  "/update/:id",
  checkAuthMiddleware(Role.STUDENT),
  EssayController.updateEssayContent
);

router.patch(
  "/delete/:id",
  checkAuthMiddleware(Role.STUDENT),
  EssayController.deleteEssay
);

export const GenerateEssayRoutes = router;
