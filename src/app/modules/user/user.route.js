import express from "express";
import {  checkAuth } from "../../middleware/authMiddleware.js";
import { UserController } from "./user.controller.js";
import { Role } from "../../utils/role.js";

const router = express.Router();

router.post("/register", UserController.registerUser);

router.get("/profile",  checkAuth(...Object.values(Role)), (req, res) => {
  res.json({ user: req.user });
});

router.get("/user-details/:id",  checkAuth(...Object.values(Role)), UserController.userDetails);

router.get("/users",  checkAuth(...Object.values(Role)), UserController.getAllUsersWithProfile);

router.post("/update-user",  checkAuth(...Object.values(Role)), UserController.updateUser);

router.post("/volunteer-work",  checkAuth(...Object.values(Role)), UserController.addVolunteerWork);

router.post(
  "/family-background",
   checkAuth(...Object.values(Role)),
  UserController.addFamilyBackground
);

router.post("/work",  checkAuth(...Object.values(Role)), UserController.addStudentWork);
router.put("/work/:id",  checkAuth(...Object.values(Role)), UserController.editStudentWork);
router.delete("/work/:id",  checkAuth(...Object.values(Role)), UserController.deleteStudentWork);

router.post("/award",  checkAuth(...Object.values(Role)), UserController.addStudentAward);
router.put("/award/:id",  checkAuth(...Object.values(Role)), UserController.editStudentAward);
router.delete("/award/:id",  checkAuth(...Object.values(Role)), UserController.deleteStudentAward);

router.post("/challenge",  checkAuth(...Object.values(Role)), UserController.addStudentChallenge);
router.put(
  "/challenge/:id",
   checkAuth(...Object.values(Role)),
  UserController.editStudentChallenge
);
router.delete(
  "/challenge/:id",
   checkAuth(...Object.values(Role)),
  UserController.deleteStudentChallenge
);

router.post("/essay",  checkAuth(...Object.values(Role)), UserController.addEssay);
router.put("/essay/:id",  checkAuth(...Object.values(Role)), UserController.editEssay);
router.delete("/essay/:id",  checkAuth(...Object.values(Role)), UserController.deleteEssay);

router.post(
  "/essay-narrative",
   checkAuth(...Object.values(Role)),
  UserController.upsertEssayNarrative
);

router.post(
  "/writing-preference",
   checkAuth(...Object.values(Role)),
  UserController.upsertWritingPreference
);

router.post(
  "/profile-progress",
   checkAuth(...Object.values(Role)),
  UserController.updateProfileProgress
);

export const UserRoutes = router;
