import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
// @ts-ignore
import cors from 'cors';
import connectDB from './config/db';
import rfpRoutes from './routes/rfpRoutes';
import vendorRoutes from './routes/vendorRoutes';
import proposalRoutes from './routes/proposalRoutes';
import debugRoutes from './routes/debugRoutes';
import { requestLogger } from './middleware/requestLogger';

// Connect DB
connectDB();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/rfps', rfpRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/debug', debugRoutes);

// Root
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
