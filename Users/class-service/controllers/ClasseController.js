const sequelize = require('../config/db')

const selectClassesProf = async (req, res) => {
  try {
    const { TeacherId } = req.body;

    const querySelect = `
      SELECT * FROM classes
      WHERE
        TeacherId LIKE :prof1 OR
        TeacherId LIKE :prof2 OR
        TeacherId LIKE :prof3 OR
        TeacherId = :exact
    `;

    const resultSelect = await sequelize.query(querySelect, {
      replacements: {
        prof1: `{${TeacherId},%`,   
        prof2: `%,${TeacherId},%`, 
        prof3: `%,${TeacherId}}`,  
        exact: `{${TeacherId}}`       
      },
      type: sequelize.QueryTypes.SELECT
    });

    res.status(200).json(resultSelect);
  } catch (err) {
    console.error(err);
    res.status(500).json('err from backend');
  }
};


module.exports={selectClassesProf}