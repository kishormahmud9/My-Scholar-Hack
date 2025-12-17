import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import globalRoutes from "./routes/globalRoutes.js";
import prisma from "./prisma/client.js";

dotenv.config();
const app = express();
app.set("prisma", prisma);
// Enable CORS for all routes
app.use(cors());
// Middleware to parse JSON
app.use(express.json());

// ✅ Global routes
app.use("/", globalRoutes);
// ✅ user related routes
app.use("/user", userRoutes);
// ✅ admin related routes
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// ✅ Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
