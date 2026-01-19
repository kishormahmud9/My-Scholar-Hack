import { Router } from "express";
import {
  getMyNotifications,
  markAsRead,
  removeNotification,
} from "./notification.controller.js";
import { checkAuthMiddleware } from "../../middleware/checkAuthMiddleware.js";

const router = Router();

router.get("/", checkAuthMiddleware("ADMIN", "OWNER"), getMyNotifications);

router.patch("/:id/read", checkAuthMiddleware("ADMIN", "OWNER"), markAsRead);

router.delete(
  "/:id",
  checkAuthMiddleware("ADMIN", "OWNER"),
  removeNotification,
);

export const NotificationRoutes = router;
