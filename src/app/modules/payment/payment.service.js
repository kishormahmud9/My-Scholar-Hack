import prisma from "../../prisma/client.js";
import { addDays } from "date-fns";
import DevBuildError from "../../lib/DevBuildError.js";
import { StatusCodes } from "http-status-codes";
import { PLAN_NAMES } from "../subscriptionStudent/subscriptionStudent.constant.js";

const PRODUCT_PLAN_MAP = {
  "HackScholarAgent:essay_hack": PLAN_NAMES.ESSAY_HACK,
  "ScholarHackAgent: essay_hack_plus": PLAN_NAMES.ESSAY_HACK_PLUS,
  "HackScholarAgent: essay_hack_pro": PLAN_NAMES.ESSAY_HACK_PRO,
};

const TRIAL_DAYS = 7;

const processSamcartEvent = async (payload) => {
  console.log("📦 Processing SamCart Payload:", payload);

  const { type, data } = payload;

  if (!data) {
    throw new DevBuildError("Invalid payload: missing data", 400);
  }

  const { product, customer, custom } = data;

  if (!product?.name || !customer?.email || !custom?.userId) {
    throw new DevBuildError(
      "Invalid payload: missing product/customer/userId",
      StatusCodes.BAD_REQUEST
    );
  }

  const userId = custom.userId;
  const productName = product.name;

  const planKey = PRODUCT_PLAN_MAP[productName];

  if (!planKey) {
    throw new DevBuildError(
      `Unknown product: ${productName}`,
      StatusCodes.BAD_REQUEST
    );
  }

  // 1️⃣ Find user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new DevBuildError(
      "User not found. Cannot assign subscription.",
      StatusCodes.NOT_FOUND
    );
  }

  // 2️⃣ Find plan
  const plan = await prisma.plan.findUnique({
    where: { name: planKey },
  });

  if (!plan) {
    throw new DevBuildError(
      `Plan not found in DB: ${planKey}`,
      StatusCodes.NOT_FOUND
    );
  }

  const now = new Date();

  // 3️⃣ Find existing subscription
  const existingSub = await prisma.subscription.findFirst({
    where: {
      userId: user.id,
      status: { in: ["active", "trial"] },
    },
  });

  // ✅ Successful payment
  if (type === "order.completed") {
    let status = "active";
    let expiresAt = null;

    if (planKey === PLAN_NAMES.ESSAY_HACK) {
      status = "trial";
      expiresAt = addDays(now, TRIAL_DAYS);
    }

    if (existingSub) {
      // Same plan → extend
      if (existingSub.planId === plan.id) {
        if (existingSub.expiresAt) {
          expiresAt = addDays(existingSub.expiresAt, TRIAL_DAYS);
        }

        await prisma.subscription.update({
          where: { id: existingSub.id },
          data: {
            expiresAt,
            status,
          },
        });

        return;
      }

      // Different plan → cancel old
      await prisma.subscription.update({
        where: { id: existingSub.id },
        data: {
          status: "canceled",
        },
      });
    }

    // Create new subscription
    await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        status,
        expiresAt,
      },
    });

    return;
  }

  // ❌ Cancellation
  if (type === "subscription.cancelled") {
    if (!existingSub) return;

    await prisma.subscription.update({
      where: { id: existingSub.id },
      data: {
        status: "canceled",
      },
    });

    return;
  }

  // ❌ Failed payment
  if (type === "payment.failed") {
    if (!existingSub) return;

    await prisma.subscription.update({
      where: { id: existingSub.id },
      data: {
        status: "past_due",
      },
    });

    return;
  }
};

export const paymentService = {
  processSamcartEvent,
};
