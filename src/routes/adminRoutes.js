import express from "express";
import { authenticateAdmin } from "../middleware/authMiddleware.js";


const adminRoutes = express.Router();

// 🔒 Admin Only Route
adminRoutes.get("/profile", authenticateAdmin, (req, res) => {
    res.json({ message: "Welcome Admin!", user: req.user });
});

export default adminRoutes;