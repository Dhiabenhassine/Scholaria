const express = require('express');
const router = express.Router();
const { GetAllUsers, 
  //Register,
  login,
  getUserById } = require('../../Admin/controllers/Usercontroller');



router.get('/getAll', async (req, res) => {
  try {
    const users = await GetAllUsers(req, res);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post('/getUserById', async (req, res) => {
  try {
    const users = await getUserById(req, res);
    res.json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
/*
router.post('/register', async (req, res) => {
  try {
    const result = await Register(req, res);
    res.json(result);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});*/
router.post('/login', async (req, res) => {
  try {
    const result = await login(req, res);
    res.json(result);
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
