const express = require("express");
const { signup, login, logout } = require("../controllers/user");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/profile", (req, res) => {
  res.send("User profile route");
});

module.exports = router;