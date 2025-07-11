const express = require('express');
const router = express.Router();
const { insertClasses,insertTeacherIdClasses,getAllClasses } = require('../controllers/Classes');

router.post('/insertClasses', async (req, res) => {
  try {
      console.log('📨 Received request to /insertClasses');

    const result = await insertClasses(req, res);
    res.json(result);
  } catch (error) {
    console.error("Error inserting class:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post('/insertTeacherIdClasses', async (req, res) => {
  try {
    console.log('📨 Received request to /insertTeacherIdClasses');

    const result = await insertTeacherIdClasses(req, res);
    res.json(result);
  } catch (error) {
    console.error("Error inserting class with teacher ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get('/getAllClasses', async (req, res) => {
  try {
    console.log('📨 Received request to /getAllClasses');

    const result = await getAllClasses();
    res.json(result);
  } catch (error) {
    console.error("Error fetching all classes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
