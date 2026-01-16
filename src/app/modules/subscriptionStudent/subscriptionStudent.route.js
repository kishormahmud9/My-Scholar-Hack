// src/app/modules/subscription/subscriptionStudent.routes.js

import express from "express";
import { SubscriptionStudentController } from "./subscriptionStudent.controller.js";
import { checkAuthMiddleware } from "../../middleware/checkAuthMiddleware.js";
import { Role } from "../../utils/role.js";

const router = express.Router();

// 🔐 All routes require authentication
router.use(checkAuthMiddleware(...Object.values(Role)));

// Get All Subscription
router.get(
  "/all-plan",
  SubscriptionStudentController.getAllPlans
);
// Get current user's subscriptions
router.get(
  "/me",
  SubscriptionStudentController.getMySubscription
);

// Get single subscription
router.get(
  "/:id",
  SubscriptionStudentController.getSubscriptionById
);

// Purchase or upgrade subscription
router.post(
  "/purchase",
  SubscriptionStudentController.purchaseSubscription
);

// Toggle plan status (ACTIVE/INACTIVE)
router.patch(
  "/toggle-status/:id",
  SubscriptionStudentController.toggleSubscriptionStatus
);

// Cancel subscription
router.patch(
  "/cancel/:id",
  SubscriptionStudentController.cancelSubscription
);

export const SubscriptionStudentRouter = router;
