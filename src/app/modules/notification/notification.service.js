import prisma from "../../prisma/client.js";
import { getIO } from "../../socket.js";

export const createNotificationForAdmins = async ({ title, message, type }) => {
  try {
    // Fetch all ADMIN and OWNER users
    const admins = await prisma.user.findMany({
      where: {
        role: {
          in: ["ADMIN", "OWNER"],
        },
      },
      select: {
        id: true,
      },
    });

    if (!admins.length) return [];

    // Prepare bulk insert data
    const notificationsData = admins.map((admin) => ({
      userId: admin.id,
      title,
      message,
      type,
    }));

    // Save notifications in DB
    await prisma.notification.createMany({
      data: notificationsData,
    });

    // Emit real-time notification to admin-room
    try {
      const io = getIO();
      io.to("admin-room").emit("new-notification", {
        title,
        message,
        type,
        createdAt: new Date(),
      });
    } catch (socketError) {
      console.error("⚠️ Socket emit failed:", socketError.message);
      // IMPORTANT: We do NOT throw error here
      // Server must stay alive
    }

    return notificationsData;
  } catch (error) {
    console.error("❌ createNotificationForAdmins error:", error);
    throw error;
  }
};

//Get all notifications for a specific user

export const getUserNotifications = async (userId) => {
  try {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("❌ getUserNotifications error:", error);
    throw error;
  }
};

//Mark a notification as read

export const markNotificationAsRead = async (notificationId) => {
  try {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  } catch (error) {
    console.error("❌ markNotificationAsRead error:", error);
    throw error;
  }
};

//Delete a notification

export const deleteNotification = async (notificationId) => {
  try {
    return await prisma.notification.delete({
      where: { id: notificationId },
    });
  } catch (error) {
    console.error("❌ deleteNotification error:", error);
    throw error;
  }
};
