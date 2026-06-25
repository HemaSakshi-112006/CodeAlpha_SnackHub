const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

// Create Order
router.post("/", async (req, res) => {
  try {

    const order = new Order(req.body);

    await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      order
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

router.get("/", async (req, res) => {
  try {

    const orders = await Order.find();

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});
router.get("/user/:userId", async (req, res) => {
  try {

    const orders = await Order.find({
      userId: req.params.userId
    });

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});
module.exports = router;