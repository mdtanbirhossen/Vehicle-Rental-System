import { pool } from "../../config/db";

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );
  return result.rows;
};

const getUserById = async (id: string) => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users WHERE id=$1`,
    [id]
  );
  return result.rows[0];
};

const updateUser = async (id: string, payload: Record<string, unknown>) => {
  const fields = [];
  const values: any[] = [];
  let index = 1;

  for (const key in payload) {
    fields.push(`${key}=$${index}`);
    values.push(payload[key]);
    index++;
  }

  if (fields.length === 0) return null;

  const query = `UPDATE users SET ${fields.join(
    ", "
  )} WHERE id=$${index} RETURNING id, name, email, phone, role`;
  values.push(id);

  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteUser = async (id: string) => {
  const bookingCheck = await pool.query(
    `SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'`,
    [id]
  );

  if (bookingCheck.rows.length > 0) {
    throw new Error("Cannot delete user with active bookings");
  }

  const result = await pool.query(
    `DELETE FROM users WHERE id=$1 RETURNING id, name, email, phone, role`,
    [id]
  );

  return result.rows[0];
};

export const userServices = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
