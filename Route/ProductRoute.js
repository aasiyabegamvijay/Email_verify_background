const express = require("express");
const router = express.Router();

const { addProduct, mailCreate, verifyOtp } = require("../controller/ProductController");

router.post("/add", addProduct);
router.post("/send-otp", mailCreate);
router.post("/verify-otp", verifyOtp);

module.exports = router;
