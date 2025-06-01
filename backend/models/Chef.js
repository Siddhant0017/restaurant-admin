const mongoose = require('mongoose');

const ChefSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  activeOrderCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['available', 'busy'],
    default: 'available'
  }
});

module.exports = mongoose.model('Chef', ChefSchema);