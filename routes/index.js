const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});
router.get('/socket', (req, res) => {
  res.render('socket');
});

module.exports = router;
