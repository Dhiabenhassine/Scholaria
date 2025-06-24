const sequelize = require('../config/db');

const selectAllStudents = async () => {
  const query = `
    SELECT * FROM Students
  `;

  const result = await sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT
  });

  return result;
};

const insertStudent = async(req,res)=>{
    try{
const {FirstName,LastName} = req.body
const queryInsertStudent = 'INSERT INTO Students (FirstName,LastName) VALUES (:FirstName,:LastName)'
const resultInsert = await sequelize.query(queryInsertStudent, {
    replacements: { FirstName: FirstName,
LastName: LastName
     },
    type: sequelize.QueryTypes.INSERT
})
        res.status(200).json({ message: "Student inserted successfully" });
}catch(error){
        console.error("Error inserting student:", error);
        res.status(500).json({ message: "Internal server error" });
}}
const selectStudentById= async(req,res)=>{
  try{
    const 	{id_Students} = req.body;
    const query = 'SELECT * FROM Students WHERE id_Students = :id_Students';
    const result = await sequelize.query(query, {
      replacements: { 	id_Students: 	id_Students },
      type: sequelize.QueryTypes.SELECT
}
    );
    if (result.length > 0) {
      res.status(200).json(result[0]);
    }
    else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
const updatetudent=async(req,res)=>{
  try{
  const {id_Students,FirstName,LastName} = req.body; 
  const updateQuery= `UPDATE Students SET FirstName = :FirstName, LastName = :LastName WHERE id_Students = :id_Students`;
  const result = await sequelize.query(updateQuery, {
    replacements: { id_Students: id_Students, FirstName: FirstName, LastName: LastName },
    type: sequelize.QueryTypes.UPDATE
  });
 
    res.status(200).json({ message: "Student updated successfully" });
 
}
  
  catch(error){
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
    selectAllStudents,insertStudent,selectStudentById,updatetudent
}