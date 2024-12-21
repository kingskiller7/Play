import express from "express";
import connectDB from "./config/db.js";
import env from "./config/env.js";
import auth from './routes/authRoute.js';
import admin from './routes/adminRoute.js';
import cors from "cors";
import http from "http";
import helmet from 'helmet';
import bodyParser from "body-parser";

connectDB();
const app = express();

app.use(cors({
    origin: env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(bodyParser.json());
app.use(helmet());

app.get('/', (req, res) => {
    res.send({ message: 'Welcome to the Server Side!' });
});
app.use('/auth', auth);
app.use('/admin', admin);

const PORT = env.PORT || 5000;
const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
}).on('error', (err) => {
    console.error('Error starting server:', err);
});