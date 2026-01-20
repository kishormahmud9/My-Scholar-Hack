import http from "http";
import app from "./app.js";
import { envVars } from "./app/config/env.js";
import { connectRedis } from "./app/config/redis.config.js";
import { initSocket } from "./app/socket.js";
import { startSubscriptionExpiryCron } from "./app/modules/student_notification/subscriptionExpiry.cron.js"; 
import { startScholarshipDeadlineCron } from "./app/modules/student_notification/scholarshipDeadline.cron.js";


const PORT = envVars.PORT || 5001;

const startServer = async () => {
  try {
    await connectRedis();

    const server = http.createServer(app);

    // Socket attach
    initSocket(server);

    // 🔔 Start student subscription cron
    startSubscriptionExpiryCron();
    startScholarshipDeadlineCron();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔌 Socket.io attached`);
      console.log(`⏰ Subscription expiry cron started`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});
