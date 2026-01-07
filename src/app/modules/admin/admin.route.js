import express from "express";

import { AdminController } from "./admin.controller.js";
import { Role } from "../../utils/role.js";
import { checkAuthMiddleware } from "../../middleware/checkAuthMiddleware.js";


const router = express.Router();

router.get(
  "/users",
 checkAuthMiddleware(Role.ADMIN, Role.OWNER),
  AdminController.getUserInfo
);

router.patch(
  "/users/:userId/status",
 checkAuthMiddleware(Role.ADMIN, Role.OWNER),
  AdminController.updateUserStatus
);

router.delete(
  "/users/:userId",
 checkAuthMiddleware(Role.ADMIN, Role.OWNER),
  AdminController.deleteUser
);

router.post("/admins",  checkAuthMiddleware(Role.ADMIN, Role.OWNER), AdminController.createAdmin);

router.get("/admins",  checkAuthMiddleware(Role.ADMIN, Role.OWNER), AdminController.getAdminList);

export const AdminRoutes = router;
