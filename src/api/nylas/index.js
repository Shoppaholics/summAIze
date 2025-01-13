import express from "express";

import authRoutes from "./authRoutes.js";
import emailRoutes from "./emailRoutes.js";

const router = express.Router();

router.use("/oauth", authRoutes);
router.use("/email", emailRoutes);

export default router;
