
const express = require("express");
const mongoose = require("mongoose");
const fitRoute = require("./controller/fitRoute.js");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.set("strictQuery", true);
mongoose.connect("mongodb+srv://learn:1980@cluster0.me4ovea.mongodb.net/fitnessdb")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("MongoDB connection error:", err));

// Middleware to parse JSON requests (already handled by bodyParser)
app.use(express.json());

// Use fitRoute for handling /fitRoute paths
app.use("/fitRoute", fitRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
