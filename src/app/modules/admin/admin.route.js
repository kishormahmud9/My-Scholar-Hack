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

export const AdminRoutes = router;
