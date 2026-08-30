import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminProductRoutes from "./routes/adminProductRoutes.js";
import adminPromotionRoutes from "./routes/adminPromotionRoutes.js";



const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "ABIKYA API is running",
  });
});

app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/products",adminProductRoutes);
app.use("/api/admin/promotions",adminPromotionRoutes);

export default app;