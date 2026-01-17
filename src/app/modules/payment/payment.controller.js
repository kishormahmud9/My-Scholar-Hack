import { paymentService } from "./payment.service.js";

const handleSamcartWebhook = async (req, res, next) => {
  try {
    const payload = req.body;

    await paymentService.processSamcartEvent(payload);

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
