const express = require('express');
const authorize = require('../middlewares/auth');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.get('/', authorize(), userController.find);
router.post('/', authorize(), userController.create);
router.get('/me', authorize(), userController.me);
router.get('/:id', authorize(), userController.get);
router.put('/:id', authorize(), userController.update);
router.delete('/:id', authorize(), userController.delete);

module.exports = router;
