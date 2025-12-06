import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const signinUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.jwtSecret as string,
    { expiresIn: "7d" }
  );

  // Exclude password
  const { password: _, ...userData } = user;

  return { token, user: userData };
};

const signupUser = async (payload: {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
}) => {
  const { name, role, email, password, phone } = payload;
  const existing = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);
  if (existing.rows.length > 0) {
    throw new Error("Email already registered");
  }

  if ((password as string).length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const hashedPass = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users(name, role, email, password, phone) VALUES($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role`,
    [name, role, email, hashedPass, phone]
  );

  return result.rows[0];
};

export const authServices = {
  signinUser,
  signupUser,
};
