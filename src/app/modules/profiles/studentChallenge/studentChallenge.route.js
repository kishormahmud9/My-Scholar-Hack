import express from "express";
import { StudentChallengeController } from "./studentChallenge.controller.js";
import { checkAuth } from "../../../middleware/authMiddleware.js";
import { Role } from "../../../utils/role.js";

const router = express.Router();

router.post(
    "/",
    checkAuth(...Object.values(Role)),
    StudentChallengeController.createChallenge
);

router.get(
    "/:userProfileId",
    checkAuth(...Object.values(Role)),
    StudentChallengeController.getChallenges
);

router.put(
    "/:id",
    checkAuth(...Object.values(Role)),
    StudentChallengeController.updateChallenge
);

router.delete(
    "/:id",
    checkAuth(...Object.values(Role)),
    StudentChallengeController.deleteChallenge
);

export const StudentChallengeRoutes = router;
