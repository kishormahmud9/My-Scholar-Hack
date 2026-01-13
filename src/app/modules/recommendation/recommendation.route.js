import express from "express";
import { checkAuthMiddleware } from "../../middleware/checkAuthMiddleware.js";
import { Role } from "../../utils/role.js";
import { RecommendationController } from "./recommendation.controller.js";

const router = express.Router();

router.post(
  "/generate",
  checkAuthMiddleware(Role.STUDENT),
  RecommendationController.generateRecommendations
);

router.get(
  "/",
  checkAuthMiddleware(Role.STUDENT),
  RecommendationController.getUserRecommendations
);

export const RecommendationRoutes = router;
