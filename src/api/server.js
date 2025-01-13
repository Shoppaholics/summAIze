import express from "express";

import nylasRoutes from "./nylas/index.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({ path: "../../.env" });

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Nylas API routes
app.use("/nylas", nylasRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
