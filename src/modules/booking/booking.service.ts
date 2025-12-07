import { pool } from "../../config/db";

const calculateDays = (start: string, end: string): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = endDate.getTime() - startDate.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const createBooking = async (payload: any) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  // Check vehicle exists and is available
  const vehicleRes = await pool.query("SELECT * FROM vehicles WHERE id=$1", [
    vehicle_id,
  ]);

  const userRes = await pool.query("SELECT * FROM users WHERE id=$1", [
    customer_id,
  ]);

  if (vehicleRes.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  if (userRes.rows.length === 0) {
    throw new Error("Customer not found");
  }

  const vehicle = vehicleRes.rows[0];

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle is not available");
  }

  // Validate dates
  const days = calculateDays(rent_start_date, rent_end_date);
  if (days <= 0) {
    throw new Error("Invalid rental dates");
  }

  const totalPrice = days * Number(vehicle.daily_rent_price);

  // Create booking
  const bookingRes = await pool.query(
    `INSERT INTO bookings 
        (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
        VALUES ($1, $2, $3, $4, $5, 'active')
        RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice]
  );

  // Update vehicle status
  await pool.query(
    `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
    [vehicle_id]
  );

  return {
    ...bookingRes.rows[0],
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

const getAllBookings = async (user: any) => {
  if (user.role === "admin") {
    const res = await pool.query(`
            SELECT b.*, 
            json_build_object('name', u.name, 'email', u.email) as customer,
            json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number) as vehicle
            FROM bookings b
            JOIN users u ON b.customer_id = u.id
            JOIN vehicles v ON b.vehicle_id = v.id
            `);
    return res.rows;
  } else {
    const res = await pool.query(
      `
                SELECT b.*,
                json_build_object('vehicle_name', v.vehicle_name,'registration_number', v.registration_number,'type', v.type) as vehicle
                FROM bookings b
                JOIN vehicles v ON b.vehicle_id = v.id
                WHERE b.customer_id=$1
                `,
      [user.id]
    );
    return res.rows;
  }
};

const updateBooking = async (id: string, user: any, status: string) => {
  const bookingRes = await pool.query("SELECT * FROM bookings WHERE id=$1", [
    id,
  ]);

  if (bookingRes.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingRes.rows[0];

  if (status === "cancelled") {
    if (user.role !== "customer" || booking.customer_id !== user.id) {
      throw new Error("Forbidden");
    }

    const today = new Date();
    const start = new Date(booking.rent_start_date);

    if (today >= start) {
      throw new Error("Cannot cancel after rental start date");
    }
  }

  if (status === "returned" && user.role !== "admin") {
    throw new Error("Only admin can mark as returned");
  }

  const updated = await pool.query(
    "UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *",
    [status, id]
  );

  // Make vehicle available
  if (status === "cancelled" || status === "returned") {
    await pool.query(
      "UPDATE vehicles SET availability_status='available' WHERE id=$1",
      [booking.vehicle_id]
    );
  }

  return updated.rows[0];
};



export const BookingService = {
  calculateDays,
  createBooking,
  getAllBookings,
  updateBooking,
};
