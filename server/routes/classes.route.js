const express = require('express');
const authorize = require('../middlewares/auth');
const ensureClassExists = require('../middlewares/ensureClassExists');
const modelController = require('../controllers/model.controller')();

const router = express.Router();

router.param('modelName', ensureClassExists);

router.get('/:modelName', authorize(), modelController.find);
router.post('/:modelName', authorize(), modelController.create);
router.get('/:modelName/:id', authorize(), modelController.get);
router.put('/:modelName/:id', authorize(), modelController.update);
router.delete('/:modelName/:id', authorize(), modelController.delete);

module.exports = router;