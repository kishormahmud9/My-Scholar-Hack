import express from "express";

import { AdminController } from "./admin.controller.js";
import { Role } from "../../utils/role.js";
import { checkAuthMiddleware } from "../../middleware/checkAuthMiddleware.js";


const router = express.Router();

router.get(
  "/users",
 checkAuthMiddleware(...Object.values(Role.ADMIN, Role.OWNER)),
  AdminController.getUserInfo
);

router.patch(
  "/users/:userId/status",
 checkAuthMiddleware(...Object.values(Role.ADMIN, Role.OWNER)),
  AdminController.updateUserStatus
);

router.delete(
  "/users/:userId",
 checkAuthMiddleware(...Object.values(Role.ADMIN, Role.OWNER)),
  AdminController.deleteUser
);

router.post("/admins",  checkAuthMiddleware(...Object.values(Role.ADMIN, Role.OWNER)), AdminController.createAdmin);

router.get("/admins",  checkAuthMiddleware(...Object.values(Role.ADMIN, Role.OWNER)), AdminController.getAdminList);

export const AdminRoutes = router;
