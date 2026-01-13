import app from "./app.js";
import { envVars } from "./app/config/env.js";
import { connectRedis } from "./app/config/redis.config.js";


const PORT = envVars.PORT || 5001;

const startServer = async () => {
  try {
    await connectRedis();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} `);
    });

    
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

