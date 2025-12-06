import express from "express";
import { vehicleControllers } from "./vehicle.controller";
import auth from "../../middleware/auth";

const router = express.Router();

// Public
router.get("/", vehicleControllers.getAllVehicles);
router.get("/:id", vehicleControllers.getVehicleById);

// Admin only
router.post("/", auth("admin"), vehicleControllers.createVehicle);
router.put("/:id", auth("admin"), vehicleControllers.updateVehicle);
router.delete("/:id", auth("admin"), vehicleControllers.deleteVehicle);

export const vehicleRoutes = router;
