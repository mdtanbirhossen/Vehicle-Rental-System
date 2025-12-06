import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";
import selfOrAdminAuth from "../../middleware/selfOrAdminAuth";

const router = express.Router();

// Admin only
router.get("/", auth("admin"), userControllers.getUser);
router.get("/:id", auth("admin"), userControllers.getSingleUser);
router.put("/:id", auth("admin", "customer"), selfOrAdminAuth(), userControllers.updateUser);
router.delete("/:id", auth("admin"), userControllers.deleteUser);

export const userRoutes = router;
