const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const userRoutes = require('./routes/userRoutes');
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
app.use('/users', userRoutes);

sequelize.sync().then(() => {
  console.log('User DB Synced');
  app.listen(3001, () => console.log('User Service on http://localhost:3001'));
});
