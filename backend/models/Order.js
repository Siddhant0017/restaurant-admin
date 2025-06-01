const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table'
  },
  clientPhone: {
    type: String,
    required: true
  },
  items: [{
    name: String,
    price: Number,
    quantity: Number
  }],
  status: {
    type: String,
    enum: ['pending', 'preparing', 'served', 'completed', 'cancelled'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['dine-in', 'takeaway'],
    default: 'dine-in'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  chefId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chef'
  }
});

module.exports = mongoose.model('Order', OrderSchema);