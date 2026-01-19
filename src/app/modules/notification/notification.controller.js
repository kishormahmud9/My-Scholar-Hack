import {
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "./notification.service.js";

//Get all notifications for the logged-in user

export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await getUserNotifications(userId);

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("❌ getMyNotifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

//Mark a notification as read

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await markNotificationAsRead(id);

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("❌ markAsRead error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
};

//Delete a notification

export const removeNotification = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteNotification(id);

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("❌ removeNotification error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
    });
  }
};
