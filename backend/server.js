const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Update CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://admin-side-app.netlify.app' ],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.get('/', (req, res) => {
  res.send('API is running');
});


// Import routes
const tableRoutes = require('./routes/tableRoutes');
const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const menuItemRoutes = require('./routes/menuItemRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Use routes
app.use('/api/tables', tableRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/upload', uploadRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

