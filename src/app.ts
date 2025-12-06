import express, { Request, Response } from "express";
import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/user/user.routes";

const app = express();
// parser
app.use(express.json());
app.use(express.urlencoded());

// initializing DB
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Vehicle Rental System!");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
