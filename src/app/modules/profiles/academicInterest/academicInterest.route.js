import express from "express";


import { Role } from "../../../utils/role.js";
import { AcademicInterestController } from "./academicInterest.controller.js";
import { checkAuth } from "../../../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  checkAuth(Role.STUDENT),
  AcademicInterestController.getAcademicInterest
);

router.post(
  "/create",
  checkAuth(Role.STUDENT),
  AcademicInterestController.createAcademicInterest
);

router.put(
  "/update",
  checkAuth(Role.STUDENT),
  AcademicInterestController.updateAcademicInterest
);

export const AcademicInterestRoutes = router;
