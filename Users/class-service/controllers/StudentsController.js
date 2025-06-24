const sequelize = require('../config/db');

const absent = async (req, res) => {
  try {
    const { id_Students, id_Classes, absent } = req.body;

    // Validate input
    if (!id_Students || !id_Classes || absent === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const selectStudent = `
      SELECT * FROM students 
      WHERE id_Students = :id_Students AND id_Classes = :id_Classes
    `;
    const student = await sequelize.query(selectStudent, {
      replacements: { id_Students, id_Classes },
      type: sequelize.QueryTypes.SELECT
    });

    if (!student || student.length === 0) {
      return res.status(404).json({ message: 'Student not found in this class' });
    }

    const updateAbsent = `
      UPDATE students 
      SET absent = :absent 
      WHERE id_Students = :id_Students AND id_Classes = :id_Classes
    `;
    await sequelize.query(updateAbsent, {
      replacements: { id_Students, id_Classes, absent },
      type: sequelize.QueryTypes.UPDATE
    });

    res.status(200).json({ message: 'Absent status updated successfully' });

  } catch (err) {
    console.error('Error in absent controller:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { absent };
