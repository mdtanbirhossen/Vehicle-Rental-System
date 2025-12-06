import { Request, Response } from "express";
import { userServices } from "./user.service";



const getUser = async (req: Request, res: Response) => {
  try {
    const data = await userServices.getAllUsers();
    res.status(200).json({
      success: true,
      message: data.length ? "Users retrieved successfully" : "No users found",
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const data = await userServices.getUserById(req.params.id as string);
    if (!data) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User fetched successfully", data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {  
    const data = await userServices.updateUser(req.params.id as string, req.body);
    if (!data) return res.status(404).json({ success: false, message: "User not found or no fields to update" });

    res.status(200).json({ success: true, message: "User updated successfully", data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const data = await userServices.deleteUser(req.params.id as string);
    if (!data) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, message: "User deleted successfully", data });
  } catch (err: any) {
    if (err.message.includes("active bookings")) {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};


export const userControllers = {
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
