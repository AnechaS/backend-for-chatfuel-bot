const express = require('express');
const authorize = require('../middlewares/auth');
const ensureClassExists = require('../middlewares/ensureClassExists');
const schemaController = require('../controllers/schema.controller');

const router = express.Router();

router.get('/', authorize(), schemaController.list);
router.get('/:modelName', authorize(), ensureClassExists, schemaController.get);

module.exports = router;