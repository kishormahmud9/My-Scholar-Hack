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
  "/",
  checkAuthMiddleware(Role.STUDENT),
  EssayController.createEssay
);

router.delete(
  "/:id",
  checkAuthMiddleware(Role.STUDENT),
  EssayController.deleteEssay
);

export const GenerateEssayRoutes = router;
