const express = require("express");
const router = express.Router();

const { signup, login, getusers } = require("../controllers");

router.post("/signup", signup);
router.post("/login", login);
router.post("/getusers", getusers);

module.exports = router;
