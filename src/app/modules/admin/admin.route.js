import express from "express";

import { AdminController } from "./admin.controller.js";
import {
  authenticateAdmin,
  authenticateUser,
} from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/users",
  authenticateUser,
  authenticateAdmin,
  AdminController.getUserInfo
);

router.patch(
  "/users/:userId/status",
  authenticateUser,
  authenticateAdmin,
  AdminController.updateUserStatus
);

router.delete(
  "/users/:userId",
  authenticateUser,
  authenticateAdmin,
  AdminController.deleteUser
);

router.post("/admins", authenticateAdmin, AdminController.createAdmin);

router.get("/admins", authenticateAdmin, AdminController.getAdminList);

router.delete(
  "/admins/:adminId",
  authenticateAdmin,
  AdminController.deleteAdmin
);

router.patch(
  "/admins/:adminId",
  authenticateAdmin,
  AdminController.updateAdmin
);

// GET all plans (admin)
router.get(
  "/plans",
  authenticateUser,
  authenticateAdmin,
  AdminController.getAllPlans
);

router.patch(
  "/plans/toggle/:planId",
  authenticateUser,
  authenticateAdmin,
  AdminController.togglePlanStatus
);

router.patch(
  "/plans/:planId",
  authenticateUser,
  authenticateAdmin,
  AdminController.updatePlan
);

router.delete(
  "/plans/:planId",
  authenticateUser,
  authenticateAdmin,
  AdminController.deletePlan
);

router.post(
  "/plans",
  authenticateUser,
  authenticateAdmin,
  AdminController.createPlan
);

router.get(
  "/offers",
  authenticateUser,
  authenticateAdmin,
  AdminController.getAllOffers
);

router.post(
  "/offers",
  authenticateUser,
  authenticateAdmin,
  AdminController.createOffer
);

router.patch(
  "/offers/toggle/:offerId",
  authenticateUser,
  authenticateAdmin,
  AdminController.toggleOfferStatus
);

router.delete(
  "/offers/:offerId",
  authenticateUser,
  authenticateAdmin,
  AdminController.deleteOffer
);

router.put(
  "/offers/:offerId",
  authenticateUser,
  authenticateAdmin,
  AdminController.updateOffer
);
export const AdminRoutes = router;
