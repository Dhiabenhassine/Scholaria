const express = require('express');
const router = express.Router();
const {selectAllStudents,insertStudent,selectStudentById,updatetudent} = require('../controllers/StudentController');

router.get('/getAllStudents', async (req, res) => {
  try {
    console.log('📨 Received request to /getAllStudents');

    const result = await selectAllStudents();
    res.json(result);
  } catch (error) {
    console.error("Error fetching all students:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
);
router.post('/insertStudent', async (req, res) => {
  try {
    console.log('📥 Received request to /insertStudent with body:', req.body);

   const result = await insertStudent(req, res);
       res.json(result);

  } catch (error) {
    console.error("Error inserting student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
);
router.post('/getStudentById', async (req, res) => {
  try {
    console.log('📨 Received request to /getStudentById with ID:', req.params.id);

  const result=  await selectStudentById(req, res);
      res.json(result);

  } catch (error) {
    console.error("Error fetching student by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
router.post('/updateStudent', async (req, res) => {
  try {
    const result = await updatetudent(req, res);
    res.json(result);
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Internal server error" });
  }})
module.exports = router;