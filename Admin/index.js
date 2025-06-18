const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const classesRoutes = require('./routes/classesRoutes');
const studentsRoutes = require('./routes/studentsRouter');
const cors = require('cors');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.on('aborted', () => {
    console.warn('⚠️ Request aborted by the client');
  });
  next();
});

app.use(cors());
app.use(bodyParser.json());
app.use('/admin', userRoutes);
app.use('/admin', classesRoutes)
app.use('/admin', studentsRoutes);
sequelize.sync().then(() => {
  console.log('User DB Synced');
  app.listen(3100, () => console.log('User Service on http://localhost:3100'));
});
