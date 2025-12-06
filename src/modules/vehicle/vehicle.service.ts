import { pool } from "../../config/db";

const createVehicle = async (payload: any) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES($1, $2, $3, $4, $5)
     RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result.rows[0];
};

const getAllVehicles = async () => {
  const result = await pool.query(
    `SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles`
  );
  return result.rows;
};

const getVehicleById = async (id: string) => {
  const result = await pool.query(
    `SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles WHERE id=$1`,
    [id]
  );
  return result.rows[0];
};

const updateVehicle = async (id: string, payload: Record<string, unknown>) => {
  const fields = [];
  const values: any[] = [];
  let index = 1;

  for (const key in payload) {
    fields.push(`${key}=$${index}`);
    values.push(payload[key]);
    index++;
  }

  if (fields.length === 0) return null;

  const query = `UPDATE vehicles SET ${fields.join(
    ", "
  )} WHERE id=$${index} RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`;
  values.push(id);

  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteVehicle = async (id: string) => {
  const bookingCheck = await pool.query(
    `SELECT * FROM bookings WHERE vehicle_id = $1 AND status = 'active'`,
    [id]
  );

  if (bookingCheck.rows.length > 0) {
    throw new Error("Cannot delete vehicle with active bookings");
  }

  const result = await pool.query(
    `DELETE FROM vehicles WHERE id=$1 RETURNING id`,
    [id]
  );
  return result.rows[0];
};

export const vehicleServices = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
