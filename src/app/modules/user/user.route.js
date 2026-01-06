import express from "express";
import { checkAuth } from "../../middleware/authMiddleware.js";
import { UserController } from "./user.controller.js";
import { Role } from "../../utils/role.js";

const router = express.Router();

router.post("/register", UserController.registerUser);
router.get("/me",checkAuth(...Object.values(Role)), UserController.getUserInfo);

// router.get("/profile", checkAuth(...Object.values(Role)) , UserController.getUserProfile);

router.get("/user-details/:id", checkAuth(...Object.values(Role)), UserController.userDetails);

router.get("/users", checkAuth(...Object.values(Role)), UserController.getAllUsersWithProfile);

router.post("/update-user", checkAuth(...Object.values(Role)), UserController.updateUser);

export const UserRoutes = router;
