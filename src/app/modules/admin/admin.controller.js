import { AdminService } from "./admin.service.js";

export const AdminController = {
  getUserInfo: async (req, res, next) => {
    try {
      const result = await AdminService.getUserInfo(req.prisma, req.query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },

  updateUserStatus: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { status } = req.body;

      const result = await AdminService.updateUserStatus(
        req.prisma,
        userId,
        status
      );

      res.json({
        success: true,
        message: "User status updated",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const { userId } = req.params;

      await AdminService.deleteUser(req.prisma, userId);

      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  createAdmin: async (req, res, next) => {
    try {
      const result = await AdminService.createAdmin(req.prisma, req.body);

      res.status(201).json({
        success: true,
        message: "Admin created successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // =========================
  // GET ADMIN LIST
  // =========================
  getAdminList: async (req, res, next) => {
    try {
      const result = await AdminService.getAdminList(req.prisma, req.query);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  },
};
