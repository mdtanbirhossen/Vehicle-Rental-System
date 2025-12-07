import express from "express";
import { BookingController } from "./booking.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", auth("admin", "customer"), BookingController.createBooking);

router.get("/", auth("admin", "customer"), BookingController.getAllBookings);

router.put("/:bookingId", auth("admin", "customer"), BookingController.updateBookings);

export const BookingRoutes = router;
