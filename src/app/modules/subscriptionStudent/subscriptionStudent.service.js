import DevBuildError from "../../lib/DevBuildError.js";
import { StatusCodes } from "http-status-codes";
import { PLAN_LIMITS, PLAN_NAMES } from "./subscriptionStudent.constant.js";

export const SubscriptionStudentService = {
  maintainSubscriptions: async (prisma, userId) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1️⃣ Auto-expire plans
    await prisma.subscriptionStudent.updateMany({
      where: {
        userId,
        subscriptionStatus: { in: ["ACTIVE", "TRAIL", "LIMIT_CROSSED"] },
        endDate: { lte: now },
      },
      data: { subscriptionStatus: "END" },
    });

    // 2️⃣ Promote oldest INACTIVE plan if no ACTIVE plan exists
    const activePlan = await prisma.subscriptionStudent.findFirst({
      where: {
        userId,
        subscriptionStatus: { in: ["ACTIVE", "TRAIL"] },
        endDate: { gt: now },
      },
    });

    if (!activePlan) {
      const nextPlan = await prisma.subscriptionStudent.findFirst({
        where: {
          userId,
          subscriptionStatus: "INACTIVE",
          endDate: { gt: now },
        },
        orderBy: { purchaseDate: "asc" },
      });

      if (nextPlan) {
        // Find the parent subscription to see if it was a trial
        const parentSub = await prisma.subscription.findUnique({
          where: { id: nextPlan.subscriptionId },
        });

        const activatedStatus =
          parentSub?.status === "trial" ? "TRAIL" : "ACTIVE";

        await prisma.subscriptionStudent.update({
          where: { id: nextPlan.id },
          data: { subscriptionStatus: activatedStatus, purchaseDate: now },
        });
        // Recursively call to check limits for the newly activated plan
        return SubscriptionStudentService.maintainSubscriptions(prisma, userId);
      }
    }

    // 3️⃣ Check current ACTIVE plan for limit crossing
    const currentActive = await prisma.subscriptionStudent.findFirst({
      where: {
        userId,
        subscriptionStatus: { in: ["ACTIVE", "TRAIL"] },
        endDate: { gt: now },
      },
      include: {
        subscription: { include: { plan: true } },
      },
    });

    if (currentActive) {
      const planName = currentActive.subscription.plan.name;
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

      if (limitInfo.maxEssays !== Infinity) {
        const threshold = limitInfo.isMonthly
          ? new Date(Math.max(currentActive.purchaseDate.getTime(), startOfMonth.getTime()))
          : currentActive.purchaseDate;

        const pCount = await prisma.essay.count({
          where: {
            userId,
            isDeleted: false,
            status: { not: "FAILED" }, // 👈 Exclude failed essays
            createdAt: { gte: threshold },
          },
        });

        if (pCount >= limitInfo.maxEssays) {
          await prisma.subscriptionStudent.update({
            where: { id: currentActive.id },
            data: { subscriptionStatus: "LIMIT_CROSSED" },
          });
          // After crossing, promote next available
          return SubscriptionStudentService.maintainSubscriptions(prisma, userId);
        }
      }
    }
  },

  getMySubscription: async (prisma, userId) => {
    await SubscriptionStudentService.maintainSubscriptions(prisma, userId);

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

    // 1.1️⃣ Determine initial status (only one ACTIVE/LIMIT_CROSSED at a time)
    const existingActive = await prisma.subscriptionStudent.findFirst({
      where: {
        userId,
        subscriptionStatus: { in: ["ACTIVE", "LIMIT_CROSSED"] },
        endDate: { gt: now },
      },
    });

    const status = existingActive ? "INACTIVE" : "ACTIVE";

    // 1️⃣ Always create a new Subscription record for every purchase
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planId,
        status: "active",
        expiresAt: endDate,
      },
    });

    // 2️⃣ Create new SubscriptionStudent record
    return prisma.subscriptionStudent.create({
      data: {
        userId,
        subscriptionId: subscription.id,
        subscriptionStatus: status,
        purchaseDate: now,
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
    // 1️⃣ Run maintenance logic to promote/expire plans
    await SubscriptionStudentService.maintainSubscriptions(prisma, userId);

    const now = new Date();

    // 2️⃣ Check for currently ACTIVE or TRAIL plan
    const activePlan = await prisma.subscriptionStudent.findFirst({
      where: {
        userId,
        subscriptionStatus: { in: ["ACTIVE", "TRAIL"] },
        endDate: { gt: now },
      },
    });

    if (activePlan) {
      // If active/trail exists, return true (limits are handled by maintainSubscriptions)
      return true;
    }

    // 3️⃣ If no active plan, check for Any plans (including Limit Crossed and Inactive)
    const anyPlans = await prisma.subscriptionStudent.findMany({
      where: {
        userId,
        subscriptionStatus: { in: ["ACTIVE", "TRAIL", "LIMIT_CROSSED", "INACTIVE"] },
        endDate: { gt: now },
      },
    });

    if (anyPlans.length > 0) {
      // User has plans but they are all either crossed or inactive
      throw new DevBuildError(
        "You have reached the essay limit for your plans. Please purchase a new plan to continue.",
        StatusCodes.FORBIDDEN
      );
    }

    // 4️⃣ No plans found - Mandate Trial Plan
    throw new DevBuildError(
      "Please get a free trial plan first to generate your first essay.",
      StatusCodes.FORBIDDEN
    );
  },
};
