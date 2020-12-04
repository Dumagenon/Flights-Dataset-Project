const router = require('express').Router();
const DB = require('../db');

router.get('/', async (req, res) => {
  try {
    res.status(200).json({
      items: [...DB.getCanceledFlight().slice(0, 5), ...DB.data.slice(0, 5)],
      total: DB.data.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
