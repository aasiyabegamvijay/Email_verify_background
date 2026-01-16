const express = require('express');
const { connectDB } = require('./db/db');
const app = express();
const ProductRoute = require("./Route/ProductRoute");

app.use(express.json());
app.use("/", ProductRoute);

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
