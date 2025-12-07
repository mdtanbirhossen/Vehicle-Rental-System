import { Request, Response } from "express";
import { BookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await BookingService.createBooking(req.body);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
      errors: err.message,
    });
  }
};

const getAllBookings = async (req: any, res: Response) => {
  try {
    const result = await BookingService.getAllBookings(req.user);

    return res.status(200).json({
      success: true,
      message:
        req.user.role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
      errors: err.message,
    });
  }
};

const updateBookings = async (req: any, res: Response) => {
  try {
    const { status } = req.body;
    const { bookingId } = req.params;

    const result = await BookingService.updateBooking(
      bookingId,
      req.user,
      status
    );

    const message =
      status === "cancelled"
        ? "Booking cancelled successfully"
        : "Booking marked as returned. Vehicle is now available";

    return res.status(200).json({
      success: true,
      message,
      data:
        status === "returned"
          ? {
              ...result,
              vehicle: { availability_status: "available" },
            }
          : result,
    });
  } catch (err: any) {
    const code =
      err.message === "Booking not found"
        ? 404
        : err.message === "Forbidden"
        ? 403
        : 400;

    return res.status(code).json({
      success: false,
      message: err.message,
      errors: err.message,
    });
  }
};
export const BookingController = {
  createBooking,
  getAllBookings,
  updateBookings,
};
