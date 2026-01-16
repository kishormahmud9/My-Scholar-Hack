import DevBuildError from "../../lib/DevBuildError.js";
import { StatusCodes } from "http-status-codes";
import { PLAN_LIMITS, PLAN_NAMES } from "./subscriptionStudent.constant.js";

export const SubscriptionStudentService = {
  getMySubscription: async (prisma, userId) => {
    // 0️⃣ Auto-expire plans
    const now = new Date();
    await prisma.subscriptionStudent.updateMany({
      where: {
        userId,
        subscriptionStatus: { in: ["ACTIVE", "TRAIL", "LIMIT_CROSSED"] },
        endDate: { lte: now },
      },
      data: { subscriptionStatus: "END" },
    });

    // 0.1️⃣ Auto-reactivate LIMIT_CROSSED plans if we are under the limit
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const count = await prisma.essay.count({
      where: {
        userId,
        isDeleted: false,
        createdAt: { gte: startOfMonth },
      },
    });

    // Get ALL current potential plans (ACTIVE and LIMIT_CROSSED)
    const allPlans = await prisma.subscriptionStudent.findMany({
      where: {
        userId,
        subscriptionStatus: { in: ["ACTIVE", "LIMIT_CROSSED"] },
        endDate: { gt: now },
      },
      include: {
        subscription: { include: { plan: true } },
      },
    });

    if (allPlans.length > 0) {
      let totalMax = 0;
      let crossedIds = [];
      let isPro = false;

      for (const p of allPlans) {
        const planName = p.subscription.plan.name;
        let limitInfo = PLAN_LIMITS[planName];
        if (!limitInfo) {
          if (planName.toLowerCase().includes("pro"))
            limitInfo = PLAN_LIMITS[PLAN_NAMES.ESSAY_HACK_PRO];
          else if (
            planName.toLowerCase().includes("+") ||
            planName.toLowerCase().includes("plus")
          )
            limitInfo = PLAN_LIMITS[PLAN_NAMES.ESSAY_HACK_PLUS];
          else if (planName.toLowerCase().includes("hack"))
            limitInfo = PLAN_LIMITS[PLAN_NAMES.ESSAY_HACK];
          else limitInfo = PLAN_LIMITS[PLAN_NAMES.FREE];
        }

        if (limitInfo.maxEssays === Infinity) isPro = true;
        else totalMax += limitInfo.maxEssays || 0;

        if (p.subscriptionStatus === "LIMIT_CROSSED") {
          crossedIds.push(p.id);
        }
      }

      if (isPro || count < totalMax) {
        if (crossedIds.length > 0) {
          await prisma.subscriptionStudent.updateMany({
            where: { id: { in: crossedIds } },
            data: { subscriptionStatus: "ACTIVE" },
          });
        }
      }
    }

    return prisma.subscriptionStudent.findMany({
      where: { userId },
      include: {
        subscription: {
          include: { plan: true },
        },
      },
    });
  },

  getById: async (prisma, id, userId) => {
    return prisma.subscriptionStudent.findFirst({
      where: { id, userId },
      include: {
        subscription: {
          include: { plan: true },
        },
      },
    });
  },

  purchaseSubscription: async (prisma, userId, planId, durationType = "MONTHLY") => {
    const now = new Date();
    const endDate = new Date(now);

    if (durationType === "YEARLY") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    // 1️⃣ Ensure Subscription exists for this user and plan
    let subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ["active", "trial"] },
      },
      orderBy: { createdAt: "desc" },
    });

    if (subscription) {
      // Update existing subscription
      subscription = await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          planId,
          status: "active",
          expiresAt: endDate,
        },
      });
    } else {
      // Create new subscription
      subscription = await prisma.subscription.create({
        data: {
          userId,
          planId,
          status: "active",
          expiresAt: endDate,
        },
      });
    }

    // 2️⃣ Create new SubscriptionStudent record (Multiple allowed)
    return prisma.subscriptionStudent.create({
      data: {
        userId,
        subscriptionId: subscription.id,
        subscriptionStatus: "ACTIVE",
        endDate,
      },
    });
  },

  toggleStatus: async (prisma, id, userId, status) => {
    const validStatuses = ["ACTIVE", "INACTIVE"];
    if (!validStatuses.includes(status)) {
      throw new DevBuildError(
        "Invalid status. Use ACTIVE or INACTIVE",
        StatusCodes.BAD_REQUEST
      );
    }

    const sub = await prisma.subscriptionStudent.findFirst({
      where: { id, userId },
    });

    if (!sub) {
      throw new DevBuildError("Subscription not found", StatusCodes.NOT_FOUND);
    }

    return prisma.subscriptionStudent.update({
      where: { id },
      data: { subscriptionStatus: status },
    });
  },

  cancelSubscription: async (prisma, userId, id) => {
    const existing = await prisma.subscriptionStudent.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new DevBuildError(
        "Subscription not found",
        StatusCodes.NOT_FOUND
      );
    }

    return prisma.subscriptionStudent.update({
      where: { id },
      data: {
        subscriptionStatus: "CANCELLED",
      },
    });
  },

  validateEssayLimit: async (prisma, userId) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 0️⃣ Auto-expire plans (Time based)
    await prisma.subscriptionStudent.updateMany({
      where: {
        userId,
        subscriptionStatus: { in: ["ACTIVE", "TRAIL", "LIMIT_CROSSED"] },
        endDate: { lte: now },
      },
      data: { subscriptionStatus: "END" },
    });

    // 1. Get all plans that are either ACTIVE or LIMIT_CROSSED
    let subStudents = await prisma.subscriptionStudent.findMany({
      where: {
        userId,
        subscriptionStatus: { in: ["ACTIVE", "LIMIT_CROSSED"] },
        endDate: { gt: now },
      },
      include: {
        subscription: {
          include: { plan: true },
        },
      },
    });

    // If no plans, check Free Trial
    if (subStudents.length === 0) {
      const freeLimit = PLAN_LIMITS[PLAN_NAMES.FREE];
      const count = await prisma.essay.count({
        where: { userId, isDeleted: false },
      });
      if (count >= freeLimit.maxEssays) {
        throw new DevBuildError(
          `You have reached the limit of ${freeLimit.maxEssays} essays for your Free plan.`,
          StatusCodes.FORBIDDEN
        );
      }
      return true;
    }

    // 2. Calculate current usage this month
    const count = await prisma.essay.count({
      where: {
        userId,
        isDeleted: false,
        createdAt: { gte: startOfMonth },
      },
    });

    // 3. Sum up limits and check if we need to re-activate LIMIT_CROSSED plans
    let totalMax = 0;
    let isPro = false;
    let activeIds = [];
    let crossedIds = [];

    for (const subStud of subStudents) {
      const planName = subStud.subscription.plan.name;
      let limitInfo = PLAN_LIMITS[planName];

      // Fallback
      if (!limitInfo) {
        if (planName.toLowerCase().includes("pro")) limitInfo = PLAN_LIMITS[PLAN_NAMES.ESSAY_HACK_PRO];
        else if (planName.toLowerCase().includes("+") || planName.toLowerCase().includes("plus")) limitInfo = PLAN_LIMITS[PLAN_NAMES.ESSAY_HACK_PLUS];
        else if (planName.toLowerCase().includes("hack")) limitInfo = PLAN_LIMITS[PLAN_NAMES.ESSAY_HACK];
        else limitInfo = PLAN_LIMITS[PLAN_NAMES.FREE];
      }

      if (limitInfo.maxEssays === Infinity) {
        isPro = true;
      } else {
        totalMax += limitInfo.maxEssays;
      }

      if (subStud.subscriptionStatus === "ACTIVE") activeIds.push(subStud.id);
      else crossedIds.push(subStud.id);
    }

    if (isPro) {
      // If we have a Pro plan, all LIMIT_CROSSED should be ACTIVE again
      if (crossedIds.length > 0) {
        await prisma.subscriptionStudent.updateMany({
          where: { id: { in: crossedIds } },
          data: { subscriptionStatus: "ACTIVE" },
        });
      }
      return true;
    }

    // 4. Status Transition Logic
    if (count >= totalMax) {
      // Mark ACTIVE plans as LIMIT_CROSSED
      if (activeIds.length > 0) {
        await prisma.subscriptionStudent.updateMany({
          where: { id: { in: activeIds } },
          data: { subscriptionStatus: "LIMIT_CROSSED" },
        });
      }
      throw new DevBuildError(
        `You have reached the combined limit of ${totalMax} essays for your active plans this month.`,
        StatusCodes.FORBIDDEN
      );
    } else {
      // If we are UNDER the limit, any LIMIT_CROSSED plans should be ACTIVE again (new month reset)
      if (crossedIds.length > 0) {
        await prisma.subscriptionStudent.updateMany({
          where: { id: { in: crossedIds } },
          data: { subscriptionStatus: "ACTIVE" },
        });
      }
    }

    return true;
  },
};
