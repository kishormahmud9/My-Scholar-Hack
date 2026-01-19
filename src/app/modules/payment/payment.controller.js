import { paymentService } from "./payment.service.js";
import { createNotificationForAdmins } from "../notification/notification.service.js";

const handleSamcartWebhook = async (req, res, next) => {
  try {
    const payload = req.body;

    console.log("Processing SamCart Payload:", payload);

    await paymentService.processSamcartEvent(payload);

    // 🔔 Admin Notification Hook (crash-safe)
    try {
      const userEmail = payload?.customer?.email || "Unknown user";
      const fullName = `${payload?.customer?.first_name || ""} ${
        payload?.customer?.last_name || ""
      }`.trim();

      const productName = payload?.product?.name || "Unknown plan";
      const price = payload?.product?.price || "";

      const displayName = fullName || userEmail;

      await createNotificationForAdmins({
        title: "New Plan Purchased",
        message: `${displayName} (${userEmail}) purchased ${productName} for $${price}`,
        type: "PLAN_PURCHASE",
      });
    } catch (notifyError) {
      console.error(
        "⚠️ Failed to send payment notification:",
        notifyError.message,
      );
      // DO NOT throw
    }

    res.status(200).json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    next(error);
  }
};

export const paymentController = {
  handleSamcartWebhook,
};
