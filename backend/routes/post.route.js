import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createPost, getFeedPosts } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", protectRoute, getFeedPosts);
router.post("/create", protectRoute, createPost);

export default router;