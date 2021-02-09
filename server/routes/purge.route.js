const express = require('express');
const modelController = require('../controllers/model.controller')();
const router = express.Router();

router.delete('/:modelName', modelController.deleteAll);

module.exports = router;
