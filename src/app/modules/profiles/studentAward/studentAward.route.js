import express from "express";
import { StudentAwardController } from "./studentAward.controller.js";
import { checkAuth } from "../../../middleware/authMiddleware.js";
import { Role } from "../../../utils/role.js";

const router = express.Router();

router.post(
    "/",
    checkAuth(...Object.values(Role)),
    StudentAwardController.createAward
);

router.get(
    "/:userProfileId",
    checkAuth(...Object.values(Role)),
    StudentAwardController.getAwards
);

router.put(
    "/:id",
    checkAuth(...Object.values(Role)),
    StudentAwardController.updateAward
);

router.delete(
    "/:id",
    checkAuth(...Object.values(Role)),
    StudentAwardController.deleteAward
);

export const StudentAwardRoutes = router;
