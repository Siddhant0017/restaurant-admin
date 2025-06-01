const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Client = require('../models/Client');
const Chef = require('../models/Chef');

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new order
const assignChefToOrder = async (orderId) => {
  try {
    // Find all available chefs
    const chefs = await Chef.find({ status: 'available' });
    
    if (chefs.length === 0) {
      throw new Error('No available chefs');
    }

    // Find chef with minimum orders
    const assignedChef = chefs.reduce((min, chef) => 
      chef.activeOrderCount < min.activeOrderCount ? chef : min, chefs[0]);

    // Update chef's orders and count
    assignedChef.orders.push(orderId);
    assignedChef.activeOrderCount += 1;
    await assignedChef.save();

    // Update order with assigned chef
    await Order.findByIdAndUpdate(orderId, { 
      chefId: assignedChef._id,
      status: 'preparing'
    });

    return assignedChef;
  } catch (error) {
    throw error;
  }
};

router.post('/', async (req, res) => {
  try {
    let client = await Client.findOne({ phone: req.body.clientPhone });
    if (client) {
      client.visits += 1;
      client.lastVisit = Date.now();
      await client.save();
    } else {
      client = new Client({
        phone: req.body.clientPhone,
        name: req.body.clientName || ''
      });
      await client.save();
    }

    const newOrder = await order.save();
    const assignedChef = await assignChefToOrder(newOrder._id);//Assign chef
    
    res.status(201).json({
      ...newOrder._doc,
      chefName: assignedChef.name
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id/complete', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.chefId) {
      const chef = await Chef.findById(order.chefId);
      if (chef) {
        chef.activeOrderCount -= 1;
        chef.orders = chef.orders.filter(o => o.toString() !== order._id.toString());
        await chef.save();
      }
    }

    order.status = 'completed';
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.body.status) order.status = req.body.status;
    if (req.body.items) order.items = req.body.items;
    if (req.body.totalAmount) order.totalAmount = req.body.totalAmount;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
});

module.exports = router;