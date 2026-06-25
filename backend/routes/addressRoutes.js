const express = require("express");
const router = express.Router();

const Address = require("../models/Address");


// ADD ADDRESS
router.post("/", async (req, res) => {
  try {
    const address = new Address(req.body);

    const savedAddress = await address.save();

    res.status(201).json(savedAddress);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});


// GET USER ADDRESSES
router.get("/user/:userId", async (req, res) => {
  try {

    const addresses = await Address.find({
      userId: req.params.userId
    });

    res.json(addresses);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});


// DELETE ADDRESS
router.delete("/:id", async (req, res) => {
  try {

    await Address.findByIdAndDelete(req.params.id);

    res.json({
      message: "Address deleted"
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// UPDATE ADDRESS
router.put("/:id", async (req, res) => {
  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" }
    );
    res.json(updatedAddress);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

module.exports = router;