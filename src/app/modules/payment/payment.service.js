import prisma from "../../prisma/client.js";
import { addDays } from "date-fns";
import DevBuildError from "../../lib/DevBuildError.js";
import { StatusCodes } from "http-status-codes";

const PRODUCT_PLAN_MAP = {
  "HackScholarAgent:  Essay Hack": "essay_hack",
  "ScholarHackAgent: Essay Hack+": "essay_hack_plus",
  "HackScholarAgent: Essay Hack Pro": "essay_hack_pro",
};

const TRIAL_DAYS = 7;

const processSamcartEvent = async (payload) => {
  console.log("Processing SamCart Payload:", payload);

  const { type, product, customer, order } = payload;

  if (!type || !product?.name || !customer?.email || !order?.id) {
    throw new DevBuildError(
      "Invalid SamCart payload: missing required fields",
      StatusCodes.BAD_REQUEST
    );
  }

  const email = customer.email.toLowerCase();
  const productName = product.name;

  const planKey = PRODUCT_PLAN_MAP[productName];

  if (!planKey) {
    throw new DevBuildError(
      `Unknown product: ${productName}`,
      StatusCodes.BAD_REQUEST
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new DevBuildError(
      "User not found for this email",
      StatusCodes.NOT_FOUND
    );
  }

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

  const existingSub = await prisma.subscription.findFirst({
    where: {
      userId: user.id,
      status: { in: ["active", "trial"] },
    },
  });

  // ✅ Successful Order
  if (type === "Order") {
    let status = "active";
    let expiresAt = null;

    if (planKey === "essay_hack") {
      status = "trial";
      expiresAt = addDays(now, TRIAL_DAYS);
    }

    if (existingSub) {
      if (existingSub.planId === plan.id) {
        if (existingSub.expiresAt) {
          expiresAt = addDays(existingSub.expiresAt, TRIAL_DAYS);
        }

        await prisma.subscription.update({
          where: { id: existingSub.id },
          data: { status, expiresAt },
        });

        return;
      }

      await prisma.subscription.update({
        where: { id: existingSub.id },
        data: { status: "canceled" },
      });
    }

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
  if (type === "Cancellation") {
    if (!existingSub) return;

    await prisma.subscription.update({
      where: { id: existingSub.id },
      data: { status: "canceled" },
    });

    return;
  }

  // ❌ Failed Payment
  if (type === "Failed payment") {
    if (!existingSub) return;

    await prisma.subscription.update({
      where: { id: existingSub.id },
      data: { status: "past_due" },
    });

    return;
  }
};

export const paymentService = {
  processSamcartEvent,
};
