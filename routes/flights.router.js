const router = require('express').Router();
const DB = require('../db');

router.get('/', async (req, res) => {
  try {
    res.status(200).json(DB.getCanceledFlight().slice(0, 10));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
