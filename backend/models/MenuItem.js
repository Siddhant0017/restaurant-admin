const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['pizza', 'burger', 'drink', 'french fries', 'veggies']
  },
  available: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  image: {
    type: String
  }
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);