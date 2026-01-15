import { Router } from "express";
import { paymentController } from "./payment.controller.js";

const router = Router();

router.post("/webhook", paymentController.handleSamcartWebhook);

export const PaymentRoutes = router;
