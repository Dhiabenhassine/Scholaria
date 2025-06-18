const sequelize = require('../config/db');

const insertClasses = async (req) => {
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

  return { message: "Class inserted successfully", classId: resultQuery[1] };
};


const insertTeacherIdClasses = async (req) => {
  const { ClassName, ClassNumber, StudentNumber, TeacherId } = req.body;
  console.log('📥 insertClasses body:', req.body);

  if (!TeacherId || typeof TeacherId !== 'number') {
    throw new Error("TeacherId must be a valid number");
  }

  const checkTeacherQuery = `
    SELECT id_Users FROM Users WHERE id_Users = :TeacherId
  `;
  const teacherResult = await sequelize.query(checkTeacherQuery, {
    replacements: { TeacherId },
    type: sequelize.QueryTypes.SELECT,
  });

  if (teacherResult.length === 0) {
    throw new Error("Teacher not found");
  }

  const checkClassQuery = `
    SELECT * FROM Classes
    WHERE ClassName = :ClassName AND ClassNumber = :ClassNumber
  `;
  const existingClass = await sequelize.query(checkClassQuery, {
    replacements: { ClassName, ClassNumber },
    type: sequelize.QueryTypes.SELECT,
  });

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

    const uniqueTeacherIds = Array.from(new Set([...existingTeacherIds, TeacherId]));

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

   return {
  message: "Class updated with new TeacherId",
  TeacherIds: uniqueTeacherIds.join(','),  // returns: "9,4,10"
}
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