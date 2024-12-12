import express from "express";
import connectDB from "./config/db.js";
import env from "./config/env.js";
import auth from './routes/authRoute.js';
import admin from './routes/adminRoute.js';
import cors from "cors";
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
    res.send({'Hello World!' : 'This is the server side of the application.'});
});
app.use('/auth', auth);
app.use('/admin', admin);

const PORT = env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
}).on('error', (err) => {
    console.error('Error starting server:', err);
});