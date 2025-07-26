const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const router = express.Router();

const User = mongoose.model(
  "user",
  new mongoose.Schema({ email: String, password: String })
);

//signup router
router.post("/auth/signup", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findone({ email });
  if (existingUser) {
    return res.status(400).json({ error: "User already exist" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();
  const token = jwt.sign({ userId: user_id }, "secret", { expiresIn: "1hr" });
  res.status(200).json({ token });
});

//login route
router.post("auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findone({ email });
  if (user && (await bcryptjs.compare(password, user.password))) {
    const token = jwt.sign({ userId: user_id }, "secret", { expiresIn: "1hr" });
  } else {
    res.status(400).json({ error: "Invalid credentials" });
  }
});

//jwt middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "secret", (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      res.user = user;
      next();
    });
  } else {
    res.sendstatus(401);
  }
}

module.exports = { router, authenticateJWT };
