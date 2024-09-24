const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("../config/db");
const User = db.users;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Router Object
const router = express.Router();
router.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST"],
    credentials: true,
  })
);
router.use(cookieParser());

// Create User
router.post("/user", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userObj = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    };

    const user = await User.create(userObj);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Error in INSERT QUERY",
      });
    }

    // I added this function in data variable not getting a perticaul added user data return
    if (user) {
      const userData = await User.findByPk(user.dataValues.id);

      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.cookie("token", token, {
        maxAge: 1440 * 60 * 1000, // 1 day in milliseconds use
      });
      res.status(201).send({
        success: true,
        message: "New User added successfully",
        data: userData,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In  Add User API",
      error: error,
    });
  }
});

//userLogin with Sequelize
router.post("/userLogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find user by email using Sequelize
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found. Please check Email or Password.",
      });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({
        success: false,
        message: "Invalid password.",
      });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      maxAge: 1440 * 60 * 1000, // 1 day in milliseconds
    });

    // Send response
    res.status(200).send({
      message: "User login successful",
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in User login API",
      error: error,
    });
  }
});

module.exports = router;
