const express = require('express');

const chatfuelRouters = require('./chatfuel');
const authRouter = require('./auth');
const usersRouters = require('./users');
const commentsRouters = require('./comments');
const peoplesRouters = require('./peoples');
const schedulesRouters = require('./schedules');
const questionsRouters = require('./questions');
const repliesRouters = require('./replies');
const quizzesRouters = require('./quizzes');
const progressesRouters = require('./progresses');
const widgetsRoutes = require('./widgets');

const router = express.Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.use('/chatfuel', chatfuelRouters);
router.use('/auth', authRouter);
router.use('/users', usersRouters);
router.use('/widgets', widgetsRoutes);
router.use('/comments', commentsRouters);
router.use('/peoples', peoplesRouters);
router.use('/schedules', schedulesRouters);
router.use('/questions', questionsRouters);
router.use('/replies', repliesRouters);
router.use('/quizzes', quizzesRouters);
router.use('/progresses', progressesRouters);

module.exports = router;
