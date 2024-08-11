const express = require('express');
const cors = require('cors');
//assetRoutes
const authRoutes = require('./routes/authRoutes');
const assetRoutes = require('./routes/assetRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const requestRoutes = require('./routes/requestRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');



require('dotenv').config();

const app = express();



// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/assets', assetRoutes);
app.use('/marketplace', marketplaceRoutes);
app.use('/api', requestRoutes);

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
