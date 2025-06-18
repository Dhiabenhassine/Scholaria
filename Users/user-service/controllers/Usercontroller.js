const sequelize = require('../config/db');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const GetAllUsers = async (req, res) => {
    try {
        const users = await sequelize.query("SELECT * FROM Users", {
            type: sequelize.QueryTypes.SELECT
        });
        res.status(200).json(users); 
        console.log('users', users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" }); 
    }
};


const Register = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    if (!name || !phone || !password) {
      return res.status(400).json({ message: "Name, phone, and password are required" });
    }

    const existingUser = await sequelize.query(
      "SELECT * FROM Users WHERE Phone = :phone",
      {
        replacements: { phone },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await sequelize.query(
      "INSERT INTO Users (Name, Phone, Pwd) VALUES (:name, :phone, :Pwd)",
      {
        replacements: {
          name,
          phone,
          Pwd: hashedPassword
        },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    res.status(201).json({
      message: "User Registered successfully",
      userId: result,
    });

  } catch (error) {
    console.error("Error Registering user:", error.message || error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password are required" });
    }

    const user = await sequelize.query(
      "SELECT * FROM Users WHERE Phone = :phone",
      {
        replacements: { phone },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (user.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].Pwd);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user[0].Id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: "Login successful",
      token,
      userId: user[0].Id,
      name: user[0].Name
    });

  } catch (error) {
    console.error("Error logging in:", error.message || error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  Register,
    GetAllUsers,
    login
};
