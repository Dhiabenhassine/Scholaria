const express = require('express');
const router = express.Router();
const {selectClassesProf} = require ('../controllers/ClasseController')
router.post('/', async (req, res) => {
  try {
    const users = await selectClassesProf(req, res);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
