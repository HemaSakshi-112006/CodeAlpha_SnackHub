const express = require("express");
const router = express.Router();

const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");


// -------------------------
// ADD TO WISHLIST
// -------------------------
router.post("/", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const existing = await Wishlist.findOne({ userId, productId });

    if (existing) {
      return res.json({ message: "Already in wishlist" });
    }

    const item = new Wishlist({
      userId,
      productId
    });

    await item.save();

    res.json({ message: "Added to wishlist" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


// -------------------------
// GET USER WISHLIST (REAL PRODUCTS)
// -------------------------
router.get("/user/:userId", async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find({
      userId: req.params.userId
    });

    const productIds = wishlistItems.map(item => item.productId);

    const products = await Product.find({
      _id: { $in: productIds }
    });

    res.json(products);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/user/:userId/product/:productId", async (req, res) => {
  try {

    await Wishlist.findOneAndDelete({
      userId: req.params.userId,
      productId: req.params.productId
    });

    res.json({ message: "Removed from wishlist" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});
// -------------------------
// DELETE FROM WISHLIST
// -------------------------
router.delete("/:id", async (req, res) => {
  try {
    await Wishlist.findByIdAndDelete(req.params.id);
    res.json({ message: "Removed from wishlist" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;