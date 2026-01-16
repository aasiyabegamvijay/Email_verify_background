const product = require('../Model/ProductModel');
const Otp = require('../Model/OtpModel');
const nodemailer = require('nodemailer');
require('dotenv').config();

/* ---------------- ADD PRODUCT (UNCHANGED) ---------------- */
const addProduct = async (req, res) => {
    try {
        const { pname, pprice } = req.body;

        if (!pname) {
            return res.status(401).json({ message: 'Name field is required' });
        }
        if (!pprice) {
            return res.status(401).json({ message: 'Price field is required' });
        }

        const savedProduct = await product.create({ pname, pprice });
        res.status(200).json({ message: 'Product added Successfully', data: savedProduct });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

/* ---------------- SEND OTP MAIL ---------------- */
const mailCreate = async (req, res) => {
    try {
        const { email } = req.body;

        // 1️⃣ Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 2️⃣ Expiry (15 minutes)
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        // 3️⃣ Save OTP in DB
        await Otp.create({ email, otp, expiresAt });

        // 4️⃣ Mail transporter
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.PASS_KEY,
            }
        });

        // 5️⃣ Send mail
        await transport.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify your OTP',
            text: `Your OTP is ${otp}. It is valid for 15 minutes. Do not share it.`
        });

        return res.status(200).json({ message: 'OTP sent successfully' });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/* ---------------- VERIFY OTP ---------------- */
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const otpRecord = await Otp.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        // Delete OTP after success
        await Otp.deleteOne({ _id: otpRecord._id });

        res.status(200).json({ message: "OTP verified successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addProduct, mailCreate, verifyOtp };
