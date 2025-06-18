const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const classRoutes = require('./routes/classRoutes');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/classes', classRoutes);

sequelize.sync().then(() => {
  console.log('Class DB Synced');
  app.listen(3002, () => console.log('Class Service on http://localhost:3002'));
});
