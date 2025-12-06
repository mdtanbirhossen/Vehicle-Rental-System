import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const data = await vehicleServices.createVehicle(req.body);
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const data = await vehicleServices.getAllVehicles();
    res.status(200).json({
      success: true,
      message: data.length
        ? "Vehicles retrieved successfully"
        : "No vehicles found",
      data,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const data = await vehicleServices.getVehicleById(req.params.id as string);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });

    res
      .status(200)
      .json({ success: true, message: "Vehicle retrieved successfully", data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const data = await vehicleServices.updateVehicle(
      req.params.id as string,
      req.body
    );
    if (!data)
      return res
        .status(404)
        .json({
          success: false,
          message: "Vehicle not found or no fields to update",
        });

    res
      .status(200)
      .json({ success: true, message: "Vehicle updated successfully", data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const data = await vehicleServices.deleteVehicle(req.params.id as string);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });

    res
      .status(200)
      .json({ success: true, message: "Vehicle deleted successfully" });
  } catch (err: any) {
    if (err.message.includes("active bookings")) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    res.status(500).json({ success: false, message: err.message });
  }
};

export const vehicleControllers = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
