import express, { json } from "express";
import connectDB from "./config/db.js";
import env from "./config/env.js";
import authRoute from "./routes/authRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";
import cors from "cors";

connectDB();
const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(json());

app.use("/api/auth", authRoute);
app.use("/api/dashboard", dashboardRoute);

const PORT = env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
}).on('error', (err) => {
    console.error('Error starting server:', err);
});