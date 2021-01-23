const express = require('express');
const funcController = require('../controllers/func.controller');

const router = express.Router();

router.post('/people', funcController.people);
router.post('/reply', funcController.reply);

module.exports = router;
