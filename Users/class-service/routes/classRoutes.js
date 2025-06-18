const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

router.get('/', async (req, res) => {
  const classes = await Class.findAll();
  res.json(classes);
});

router.post('/', async (req, res) => {
  const newClass = await Class.create(req.body);
  res.json(newClass);
});

module.exports = router;
