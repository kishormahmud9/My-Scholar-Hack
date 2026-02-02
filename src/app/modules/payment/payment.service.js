import prisma from "../../prisma/client.js";
import { addDays } from "date-fns";
import DevBuildError from "../../lib/DevBuildError.js";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { SubscriptionStudentService } from "../subscriptionStudent/subscriptionStudent.service.js";
import { SAMCART_CHECKOUT_URLS } from "./payment.constant.js";
import { generateInvoicePDF } from "../../utils/template/invoice.mjs";

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
  const productName = product.name.trim();

  // Find planKey (robust matching)
  let planKey = null;
  for (const [key, value] of Object.entries(PRODUCT_PLAN_MAP)) {
    // Normalize spaces and case for matching
    const normalizedKey = key.replace(/\s+/g, " ").toLowerCase();
    const normalizedProductName = productName.replace(/\s+/g, " ").toLowerCase();

    if (normalizedKey === normalizedProductName || normalizedProductName.includes(value.replace(/_/g, " "))) {
      planKey = value;
      break;
    }
  }

  if (!planKey) {
    console.error(`❌ Unknown product: "${productName}"`);
    throw new DevBuildError(
      `Unknown product: ${productName}`,
      StatusCodes.BAD_REQUEST
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error(`❌ User not found for email: ${email}`);
    throw new DevBuildError(
      "User not found for this email",
      StatusCodes.NOT_FOUND
    );
  }

  const plan = await prisma.plan.findUnique({
    where: { name: planKey },
  });

  if (!plan) {
    console.error(`❌ Plan not found in DB: ${planKey}`);
    throw new DevBuildError(
      `Plan not found in DB: ${planKey}`,
      StatusCodes.NOT_FOUND
    );
  }

  const now = new Date();

  // ✅ Successful Order
  if (type === "Order") {
    console.log(`✅ Processing successful order for user ${user.id}, plan ${planKey}`);
    let status = "active";
    let expiresAt = addDays(now, 30); // Default to 30 days

    // Determine if it should be a trial (Only for first-time essay_hack orders)
    if (planKey === "essay_hack") {
      const hasUsedTrial = await prisma.subscription.findFirst({
        where: {
          userId: user.id,
          planId: plan.id,
          status: "trial",
        },
      });

      if (!hasUsedTrial) {
        status = "trial";
        expiresAt = addDays(now, TRIAL_DAYS);
      } else {
        // This is a paid order/renewal for the same plan
        status = "active";
        expiresAt = addDays(now, 30);
      }
    }

    // 1️⃣ ALWAYS Create a new Subscription record
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        status,
        expiresAt,
      },
    });

    // 2️⃣ Generate Invoice PDF
    const invoiceDir = "uploads/invoice";
    const invoiceFileName = `invoice-${order.id}-${Date.now()}.pdf`;
    const invoiceFilePath = path.join(invoiceDir, invoiceFileName);
    const invoiceUrl = `/uploads/invoice/${invoiceFileName}`;

    try {
      const invoiceData = {
        orderId: order.id,
        customerName: `${customer.first_name || ""} ${customer.last_name || ""}`.trim() || email,
        customerEmail: email,
        productName: productName,
        amount: product.price || 0,
        date: now.toLocaleDateString(),
      };

      await generateInvoicePDF(invoiceData, invoiceFilePath);
      console.log(`📄 Invoice generated at: ${invoiceFilePath}`);
    } catch (invoiceError) {
      console.error("⚠️ Failed to generate invoice:", invoiceError.message);
      // We don't throw here to avoid failing the payment processing if only invoice generation fails
    }

    // 3️⃣ Create SubscriptionStudent record for the queueing system
    // 1.1️⃣ If a new plan is bought, any existing ACTIVE, TRAIL, or LIMIT_CROSSED plan should be marked INACTIVE
    await prisma.subscriptionStudent.updateMany({
      where: {
        userId: user.id,
        subscriptionStatus: { in: ["ACTIVE", "TRAIL", "LIMIT_CROSSED"] },
        endDate: { gt: now },
      },
      data: { subscriptionStatus: "INACTIVE" },
    });

    const studentStatus = status === "trial" ? "TRAIL" : "ACTIVE";

    await prisma.subscriptionStudent.create({
      data: {
        userId: user.id,
        subscriptionId: subscription.id,
        subscriptionStatus: studentStatus,
        purchaseDate: now,
        endDate: expiresAt,
        payload: payload, // Store the raw SamCart webhook payload
        invoiceUrl: invoiceUrl,
        invoiceFilePath: invoiceFilePath.replace(/\\/g, "/"),
      },
    });

    console.log(`✨ SubscriptionStudent created for user ${user.id} with status ${studentStatus}`);

    // 4️⃣ Run maintenance to ensure the correct plan is active and update isPlan status
    await SubscriptionStudentService.maintainSubscriptions(prisma, user.id);

    return;
  }

  // ❌ Cancellation
  if (type === "Cancellation") {
    // Note: existingSub was not defined in the original snippet for Cancellation/Failed payment
    // But logically we should find the active subscription for the user/plan
    const existingSub = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: { in: ["active", "trial", "past_due"] },
      },
      orderBy: { createdAt: "desc" }
    });

    if (!existingSub) return;

    await prisma.subscription.update({
      where: { id: existingSub.id },
      data: { status: "canceled" },
    });

    return;
  }

  // ❌ Failed Payment
  if (type === "Failed payment") {
    const existingSub = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: { in: ["active", "trial"] },
      },
      orderBy: { createdAt: "desc" }
    });

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
  checkRecentSubscription: async (userId) => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const recentSubscription = await prisma.subscriptionStudent.findFirst({
      where: {
        userId,
        subscriptionStatus: { in: ["ACTIVE", "TRAIL"] },
        purchaseDate: { gte: fiveMinutesAgo },
      },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    return recentSubscription;
  },
  getCheckoutUrl: async (planKey, email) => {
    const baseUrl = SAMCART_CHECKOUT_URLS[planKey];
    if (!baseUrl) return null;

    // Check if URL has a fragment (#)
    const [mainUrl, fragment] = baseUrl.split("#");
    const separator = mainUrl.includes("?") ? "&" : "?";

    // Reconstruct URL: mainUrl + ?email=... + #fragment
    const finalUrl = `${mainUrl}${separator}email=${encodeURIComponent(
      email
    )}${fragment ? "#" + fragment : ""}`;

    return finalUrl;
  },
};
