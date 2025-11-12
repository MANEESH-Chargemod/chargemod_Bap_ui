import express from "express";
import {
  getUserProfile,
  upsertUserProfile,
  deleteUserProfile,
} from "../controllers/users.js";

const router = express.Router();

router.get("/:userId", getUserProfile);
router.put("/:userId", upsertUserProfile);
router.delete("/:userId", deleteUserProfile);

export default router;
