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

  // =========================
  // DELETE ADMIN
  // =========================
  deleteAdmin: async (req, res, next) => {
    try {
      const { adminId } = req.params;
      const loggedInAdminId = req.user.id; // from auth token

      const result = await AdminService.deleteAdmin(
        req.prisma,
        adminId,
        loggedInAdminId
      );

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },

  // =========================
  // UPDATE ADMIN
  // =========================
  updateAdmin: async (req, res, next) => {
    try {
      const { adminId } = req.params;
      const loggedInAdminId = req.user.id;

      const result = await AdminService.updateAdmin(
        req.prisma,
        adminId,
        loggedInAdminId,
        req.body
      );

      res.status(200).json({
        success: true,
        message: "Admin updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // =========================
  // GET ALL PLANS (ADMIN)
  // =========================
  getAllPlans: async (req, res, next) => {
    try {
      const plans = await AdminService.getAllPlans(req.prisma);

      res.status(200).json({
        success: true,
        data: plans,
      });
    } catch (error) {
      next(error);
    }
  },

  // =========================
  // TOGGLE PLAN STATUS
  // =========================
  togglePlanStatus: async (req, res, next) => {
    try {
      const { planId } = req.params;

      const updatedPlan = await AdminService.togglePlanStatus(
        req.prisma,
        planId
      );

      res.status(200).json({
        success: true,
        message: "Plan status updated successfully",
        data: updatedPlan,
      });
    } catch (error) {
      next(error);
    }
  },

  // =========================
  // UPDATE PLAN (EDIT)
  // =========================
  updatePlan: async (req, res, next) => {
    try {
      const { planId } = req.params;

      const updatedPlan = await AdminService.updatePlan(
        req.prisma,
        planId,
        req.body
      );

      res.status(200).json({
        success: true,
        message: "Plan updated successfully",
        data: updatedPlan,
      });
    } catch (error) {
      next(error);
    }
  },

  // =========================
  // DELETE PLAN
  // =========================
  deletePlan: async (req, res, next) => {
    try {
      const { planId } = req.params;

      const result = await AdminService.deletePlan(req.prisma, planId);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },

  // =========================
  // CREATE PLAN
  // =========================
  createPlan: async (req, res, next) => {
    try {
      const plan = await AdminService.createPlan(req.prisma, req.body);

      res.status(201).json({
        success: true,
        message: "Plan created successfully",
        data: plan,
      });
    } catch (error) {
      next(error);
    }
  },

  // =========================
  // GET ALL OFFERS (ADMIN)
  // =========================
  getAllOffers: async (req, res, next) => {
    try {
      const offers = await AdminService.getAllOffers(req.prisma);

      res.status(200).json({
        success: true,
        data: offers,
      });
    } catch (error) {
      next(error);
    }
  },

  // =========================
  // CREATE OFFER
  // =========================
  createOffer: async (req, res, next) => {
    try {
      const offer = await AdminService.createOffer(req.prisma, req.body);

      res.status(201).json({
        success: true,
        message: "Offer created successfully",
        data: offer,
      });
    } catch (error) {
      next(error);
    }
  },

  // =========================
  // TOGGLE OFFER STATUS
  // =========================
  toggleOfferStatus: async (req, res, next) => {
    try {
      const { offerId } = req.params;

      const updatedOffer = await AdminService.toggleOfferStatus(
        req.prisma,
        offerId
      );

      res.status(200).json({
        success: true,
        message: "Offer status updated",
        data: updatedOffer,
      });
    } catch (error) {
      next(error);
    }
  },

  // =========================
  // DELETE OFFER
  // =========================
  deleteOffer: async (req, res, next) => {
    try {
      const { offerId } = req.params;

      await AdminService.deleteOffer(req.prisma, offerId);

      res.status(200).json({
        success: true,
        message: "Offer deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  // =========================
  // UPDATE OFFER
  // =========================
  updateOffer: async (req, res, next) => {
    try {
      const { offerId } = req.params;

      const updatedOffer = await AdminService.updateOffer(
        req.prisma,
        offerId,
        req.body
      );

      res.status(200).json({
        success: true,
        message: "Offer updated successfully",
        data: updatedOffer,
      });
    } catch (error) {
      next(error);
    }
  },
};
