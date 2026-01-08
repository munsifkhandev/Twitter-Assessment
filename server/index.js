const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

app.use(express.json());

connectDB();
app.get("/", (req, res) => {
  res.send("Hello, World!, This is my Twitter Assessment Server.");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
