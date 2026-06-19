const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  payment: {
    type: String,
    required: true
  },

  items: [
    {
      name: String,
      price: Number,
      qty: Number
    }
  ],

  total: {
    type: Number,
    required: true
  },

  orderDate: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Order", orderSchema);