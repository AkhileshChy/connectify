import express from "express";
import { getSuggestedConnections } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/suggestions",protectRoute, getSuggestedConnections);

export default router;