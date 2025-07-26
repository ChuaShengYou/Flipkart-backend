const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const Cart = mongoose.model(
  "Cart",
  new mongoose.Schema({
    userId: String,
    items: [
      {
        productId: String,
        quantity: Number,
      },
    ],
  })
);

router.post("/cart/add", async (req, res) => {
  try {
    const { productId, quantity = 1, user } = req.body;
    if (!productid || !user) {
      return res
        .status(400)
        .json({ message: "Productid and user is required" });
    }
    let cart = await Cart.findOne({ userId: user, status: "active" });

    if (!cart) {
      cart = new cart({ userId: user, items: [], status: "active" });
    }

    const exisitingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (exisitingItemIndex > -1) {
      cart.items[exisitingItemIndex].quantity += parseInt(quantity);
    } else {
      cart.items.push({
        productId,
        quantity: parseInt(quantity),
      });
    }
    cart.updateAt = new Date();
    await cart.save();
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error, item has not been added" });
  }
});

router.get("/carts", async (req, res) => {
  try {
    const carts = await Cart.find({});

    res.status(200).json({
      sucess: true,
      count: carts.length,
      data: carts,
    });
  } catch (error) {
    console.log("Error fetching the data ", error);
    res.status(500).json({
      sucess: false,
      message: "Failed to fetch data",
      error: error.message,
    });
  }
});

module.exports = router;
