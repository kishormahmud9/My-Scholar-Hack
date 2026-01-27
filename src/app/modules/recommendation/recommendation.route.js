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

router.get(
  "/all",
  checkAuthMiddleware(...Object.values(Role)),
  RecommendationController.getAllRecommendations
);

router.get(
  "/scholarships",
  checkAuthMiddleware(...Object.values(Role)),
  RecommendationController.getScholarships
);

router.get(
  "/user/:userId",
  checkAuthMiddleware(...Object.values(Role)),
  RecommendationController.getRecommendationByUserId
);

export const RecommendationRoutes = router;
