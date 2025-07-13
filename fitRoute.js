const express = require("express");
const fitSchema = require("../model/fitSchema");
const userSchema = require("../model/user");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { createSecretToken } = require("../util/secretToken");
const jwt = require("jsonwebtoken");

const fitRoute = express.Router();

// POST request to create a new fitness record
fitRoute.post("/create-fitness", async (req, res) => {
  try {
    console.log("Received data:", req.body.User);
    var userToken = req.body.User;
    let decoded;
    try {
      decoded = jwt.verify(userToken, 'tokenPass');
      console.log(decoded);
    } catch (err) {
        console.error("JWT verification error:", err.message);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
    console.log(decoded);
    req.body.User = decoded.id;
    const data = await fitSchema.create(req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

fitRoute.post("/create-user", async (req, res) => {
  try {
    console.log("Received data:", req.body);
    const data = await userSchema.create(req.body);
    console.log(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
});

fitRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if(!email || !password ){
      console.log(req);
      return res.json({message:'All fields are required'})
    }
    const user = await userSchema.findOne({ email });
    if(!user){
      return res.json({message:'Incorrect password or email' }) 
    }
    const auth = await bcrypt.compare(password,user.password)
    if (!auth) {
      return res.json({message:'Incorrect password or email' }) 
    }
    else{
    
    const token = createSecretToken(user._id);
    res.json({message : "login successful", token: token, email: email});
    console.log(token);
    }
  } catch (error) {
    console.error(error);
  }
});

// GET request to retrieve all fitness records
fitRoute.get("/", async (req, res) => {
  try {
    const data = await fitSchema.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

fitRoute.post("/", async (req, res) => {
  try {
    console.log(req);
    const user = jwt.verify(req.body.token,"tokenPass");
    const data = await fitSchema.findByUser(user.id);
    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET request to retrieve a fitness record by ID
fitRoute.get("/update-fitness/:id", async (req, res) => {
  try {
    const data = await fitSchema.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ error: "Fitness record not found" });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// PUT request to update a fitness record by ID
// PUT request to update a fitness record by ID
fitRoute.put("/update-fitness/:id", async (req, res) => {
  try {
    const user = jwt.verify(req.body.Token,"tokenPass").id;
    const updatedData = await fitSchema.findByIdAndUpdate(
      req.params.id,
      { $set: {"Name":req.body.Name,"Activity":req.body.Activity,"Duration":req.body.Duration,"Date":req.body.Date,"User":user} }, // Update with the new data from req.body
      { new: true } // Return the updated document
    );
    if (!updatedData) {
      return res.status(404).json({ error: "Fitness record not found" });
    }
    res.status(200).json(updatedData); // Send back the updated data
  } catch (err) {
    console.error("Error updating fitness record:", err);
    res.status(500).json({ error: "Failed to update fitness record" });
  }
});



// DELETE request to delete a fitness record by ID
fitRoute.delete("/delete-fitness/:id", async (req, res) => {
  try {
    console.log("Deleting fitness record with ID:", req.params.id);
    const data = await fitSchema.findByIdAndDelete(new mongoose.Types.ObjectId(req.params.id));
    if (!data) {
      console.log("Fitness record not found");
      return res.status(404).json({ error: "Fitness record not found" });
    }
    res.status(200).json(data);
  } catch (err) {
    console.error("Error deleting fitness record:", err);
    res.status(500).json({ error: "Failed to delete fitness record" });
  }
});
module.exports = fitRoute;
