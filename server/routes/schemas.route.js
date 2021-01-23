const express = require('express');
const authorize = require('../middlewares/auth');
const schemaController = require('../controllers/schema.controller');

const router = express.Router();

router.get('/', authorize(), schemaController.list);
router.get('/:modelName', authorize(), schemaController.get);

module.exports = router;