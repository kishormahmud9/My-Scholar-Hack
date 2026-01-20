import { Router } from "express";
import {
  getMyNotifications,
  markAsRead,
  removeNotification,
} from "./notification.controller.js";
import { checkAuthMiddleware } from "../../middleware/checkAuthMiddleware.js";

const router = Router();

router.get("/", checkAuthMiddleware("ADMIN", "OWNER"), getMyNotifications);

router.patch(
  "/:recipientId/read",
  checkAuthMiddleware("ADMIN", "OWNER"),
  markAsRead,
);

router.delete(
  "/:recipientId",
  checkAuthMiddleware("ADMIN", "OWNER"),
  removeNotification,
);

export const NotificationRoutes = router;
