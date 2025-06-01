const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Client = require('../models/Client');
const Table = require('../models/Table');

router.get('/metrics', async (req, res) => {
  try {
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Count total orders
    const totalOrders = orders.length;
    
    // Count unique clients
    const totalClients = await Client.countDocuments();
    
    // Count tables by status
    const tables = await Table.find();
    const availableTables = tables.filter(table => table.status === 'available').length;
    const occupiedTables = tables.filter(table => table.status === 'occupied').length;
    const reservedTables = tables.filter(table => table.status === 'reserved').length;
    
    res.json({
      totalRevenue,
      totalOrders,
      totalClients,
      tables: {
        total: tables.length,
        available: availableTables,
        occupied: occupiedTables,
        reserved: reservedTables
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get revenue data for charts
router.get('/revenue-chart', async (req, res) => {
  try {
    const { period } = req.query;
    let dateFilter = {};
    
    if (period === 'daily') {
      // Get today's data
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dateFilter = { createdAt: { $gte: today } };
    } else if (period === 'weekly') {
      // Get this week's data
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      dateFilter = { createdAt: { $gte: startOfWeek } };
    }
    
    const orders = await Order.find(dateFilter);
    
    // Process data for chart
    let chartData = [];
    
    if (period === 'daily') {
      // Group by hour
      const hourlyData = {};
      for (let i = 0; i < 24; i++) {
        hourlyData[i] = 0;
      }
      
      orders.forEach(order => {
        const hour = new Date(order.createdAt).getHours();
        hourlyData[hour] += order.totalAmount;
      });
      
      chartData = Object.keys(hourlyData).map(hour => ({
        label: `${hour}:00`,
        value: hourlyData[hour]
      }));
    } else if (period === 'weekly') {
      // Group by day of week
      const weeklyData = {
        0: 0, // Sunday
        1: 0, // Monday
        2: 0, // Tuesday
        3: 0, // Wednesday
        4: 0, // Thursday
        5: 0, // Friday
        6: 0  // Saturday
      };
      
      orders.forEach(order => {
        const day = new Date(order.createdAt).getDay();
        weeklyData[day] += order.totalAmount;
      });
      
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      chartData = Object.keys(weeklyData).map(day => ({
        label: dayNames[day],
        value: weeklyData[day]
      }));
    }
    
    res.json(chartData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get order summary data
router.get('/order-summary', async (req, res) => {
  try {
    const { period } = req.query;
    let dateFilter = {};
    
    // Set date filter based on period
    if (period === 'daily') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dateFilter.createdAt = { $gte: today };
    } else if (period === 'weekly') {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      dateFilter.createdAt = { $gte: lastWeek };
    }

    // Get all orders for the period
    const orders = await Order.find(dateFilter);

    // Calculate totals
    const totalOrders = orders.length;
    const servedOrders = orders.filter(order => order.status === 'served').length;
    const dineInOrders = orders.filter(order => order.type === 'dine-in').length;
    const takeAwayOrders = orders.filter(order => order.type === 'takeaway').length;

    // Calculate percentages
    const servedPercentage = Math.round((servedOrders / totalOrders) * 100) || 0;
    const dineInPercentage = Math.round((dineInOrders / totalOrders) * 100) || 0;
    const takeAwayPercentage = Math.round((takeAwayOrders / totalOrders) * 100) || 0;

    const summaryData = [
      {
        label: 'Served',
        value: servedOrders.toString().padStart(2, '0'),
        percentage: `${servedPercentage}%`,
        color: '#2a2a2a'
      },
      {
        label: 'Dine in',
        value: dineInOrders.toString().padStart(2, '0'),
        percentage: `${dineInPercentage}%`,
        color: '#666666'
      },
      {
        label: 'Take Away',
        value: takeAwayOrders.toString().padStart(2, '0'),
        percentage: `${takeAwayPercentage}%`,
        color: '#bababa'
      }
    ];

    res.json(summaryData);
  } catch (error) {
    console.error('Error in order summary:', error);
    res.status(500).json({ message: 'Error fetching order summary' });
  }
});

// Get chef orders data
router.get('/chef-orders', async (req, res) => {
  try {
   
    const chefData = [ // Mock data for chefs
      { name: "Manesh", orders: "03" },
      { name: "Pritam", orders: "07" },
      { name: "Yash", orders: "05" },
      { name: "Tenzen", orders: "08" },
    ];
    
    res.json(chefData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;