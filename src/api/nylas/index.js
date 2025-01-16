import express from "express";

import authRoutes from "./authRoutes.js";
import calendarRoutes from "./calendarRoutes.js";
import emailRoutes from "./emailRoutes.js";

const router = express.Router();

router.use("/oauth", authRoutes);
router.use("/email", emailRoutes);
router.use("/calendar", calendarRoutes);

export default router;
