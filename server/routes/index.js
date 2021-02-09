const express = require('express');
const authorize = require('../middlewares/auth');
const reqOmitWithNull = require('../middlewares/reqOmitWithNull');
const authController = require('../controllers/auth.controller');
const usersRoute = require('./users.route');
const classesRoute = require('./classes.route');
const purgeRoute = require('./purge.route');
const schemasRoute = require('./schemas.route');
const statsRoute = require('./stats.route');
const funcsRoute = require('./funcs.route');

const router = express.Router();

router.post('/login', authController.login);
router.post('/logout', authorize(), authController.logout);
router.use('/users', usersRoute);
router.use('/classes', classesRoute);
router.use('/purge', purgeRoute);
router.use('/schemas', schemasRoute);
router.use('/stats', statsRoute);
router.use('/funcs', reqOmitWithNull, funcsRoute);
router.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = router;