const sequelize = require('../config/db');

const insertClasses = async (req, res) => {
  try {
    const { ClassName, ClassNumber } = req.body;
    console.log('📥 insertClasses body:', req.body);

    const queryInsertClass = `
      INSERT INTO Classes (ClassName, ClassNumber) 
      VALUES (:ClassName, :ClassNumber)
    `;

    const resultQuery = await sequelize.query(queryInsertClass, {
      replacements: { ClassName, ClassNumber },
      type: sequelize.QueryTypes.INSERT
    });

    res.status(200).json({ message: 'insert Class success' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




const insertTeacherIdClasses = async (req, res) => {
  try {
    const { ClassName, ClassNumber, TeacherId } = req.body;
    console.log('📥 insertClasses body:', req.body);

    if (!TeacherId || isNaN(TeacherId)) {
      return res.status(400).json({ message: "TeacherId must be a valid number" });
    }

    const checkTeacherQuery = `
      SELECT id_Users FROM Users WHERE id_Users = :TeacherId
    `;
    const teacherResult = await sequelize.query(checkTeacherQuery, {
      replacements: { TeacherId },
      type: sequelize.QueryTypes.SELECT,
    });

    if (teacherResult.length === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const checkClassQuery = `
      SELECT * FROM Classes
      WHERE ClassName = :ClassName AND ClassNumber = :ClassNumber
    `;
    const existingClass = await sequelize.query(checkClassQuery, {
      replacements: { ClassName, ClassNumber },
      type: sequelize.QueryTypes.SELECT,
    });
console.log('🎯 Existing Class:', existingClass);
console.log('💡 TeacherId field in DB:', existingClass[0].TeacherId);

    if (existingClass.length > 0) {
      const rawTeacherIds = existingClass[0].TeacherId;

      let existingTeacherIds = [];

      if (Array.isArray(rawTeacherIds)) {
        existingTeacherIds = rawTeacherIds;
      } else if (typeof rawTeacherIds === 'string') {
        existingTeacherIds = rawTeacherIds
          .replace(/[{}]/g, "")
          .split(",")
          .map(id => parseInt(id))
          .filter(id => !isNaN(id));
      } else if (rawTeacherIds !== null && rawTeacherIds !== undefined) {
        existingTeacherIds = [parseInt(rawTeacherIds)];
      }

      const uniqueTeacherIds = Array.from(new Set([...existingTeacherIds, parseInt(TeacherId)]));

      const updateQuery = `
        UPDATE Classes
        SET TeacherId = :TeacherIds
        WHERE ClassName = :ClassName AND ClassNumber = :ClassNumber
      `;
      await sequelize.query(updateQuery, {
        replacements: {
          TeacherIds: `{${uniqueTeacherIds.join(',')}}`,
          ClassName,
          ClassNumber,
        },
        type: sequelize.QueryTypes.UPDATE,
      });

      return res.status(200).json({
        message: "update TeacherId Class Sucess"
      });
    } else {
      return res.status(404).json({ message: "Class not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};





const getAllClasses = async () => {
  const queryGetAllClasses = `
    SELECT * FROM Classes
  `;

  const resultQuery = await sequelize.query(queryGetAllClasses, {
    type: sequelize.QueryTypes.SELECT
  });

  return resultQuery;
}

module.exports = {
  insertClasses,
  insertTeacherIdClasses,
  getAllClasses
};