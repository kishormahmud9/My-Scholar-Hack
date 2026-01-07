import express from "express";
import { StudentChallengeController } from "./studentChallenge.controller.js";
import { Role } from "../../../utils/role.js";
import { checkAuthMiddleware } from "../../../middleware/checkAuthMiddleware.js";

const router = express.Router();

router.post(
    "/",
    checkAuthMiddleware(...Object.values(Role)),
    StudentChallengeController.createChallenge
);

router.get(
    "/:userProfileId",
    checkAuthMiddleware(...Object.values(Role)),
    StudentChallengeController.getChallenges
);

router.put(
    "/:id",
    checkAuthMiddleware(...Object.values(Role)),
    StudentChallengeController.updateChallenge
);

router.delete(
    "/:id",
    checkAuthMiddleware(...Object.values(Role)),
    StudentChallengeController.deleteChallenge
);

export const StudentChallengeRoutes = router;
