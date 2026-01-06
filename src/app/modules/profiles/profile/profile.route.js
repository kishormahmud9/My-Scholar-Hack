import express from "express";
import { ProfileController } from "./profile.controller.js";
import { checkAuth } from "../../../middleware/authMiddleware.js";
import { Role } from "../../../utils/role.js";

const router = express.Router();

router.post("/upsert", checkAuth(...Object.values(Role)), ProfileController.upsertUserProfile);
router.get("/me", checkAuth(...Object.values(Role)), ProfileController.getProfileMe);

export const ProfileRoutes = router;
