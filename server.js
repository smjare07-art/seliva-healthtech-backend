const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Seliva HealthTech Backend Running");
});
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);
const appointmentRoutes =require("./routes/appointmentRoutes");

app.use(
  "/api/appointments",
  appointmentRoutes
);
const availabilityRoutes =
require(
  "./routes/availabilityRoutes"
);

app.use(
  "/api/availability",
  availabilityRoutes
);
const mlRoutes =
require("./routes/mlRoutes");

app.use(
"/api/ml",
mlRoutes
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});