const express = require('express');
const createHttpError = require('http-errors');
const httpStatus = require('http-status');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('config');
const mongoose = require('mongoose');
const mongooseErrorHandler = require('mongoose-validation-error-message-handler');
const glob = require('glob');
const path = require('path');
const morgan = require('morgan');
const logger = require('./utils/logger');
const ensureAPIKeyIsValid = require('./middlewares/ensureAPIKeyIsValid');

const routes = require('./routes');

// Load Models
glob.sync(path.resolve('models', '*.model.js')).forEach((file) => {
  require(file);
});

// Database Connect
mongoose.Promise = Promise;
mongoose.connect(config.get('databaseURI'), {
  ...(config.has('databaseOptions') && config.get('databaseOptions')),
  useNewUrlParser: true,
  keepAlive: 1,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.enable('trust proxy');
// app.use(morgan('dev'));

if (process.env.NODE_ENV === 'test') {
  app.use(
    morgan('short', {
      stream: {
        write: message => {
          logger.info(message.trim());
        }
      }
    })
  );
}

app.use('/', ensureAPIKeyIsValid, routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createHttpError(httpStatus.NOT_FOUND));
});

// error handler
app.use((err, req, res, next) => {
  const error = mongooseErrorHandler(err);
  if (error.name === 'MongooseValidatorError') {
    error.status = httpStatus.BAD_REQUEST;
  }

  const status = error.status || httpStatus.INTERNAL_SERVER_ERROR;
  const response = {
    code: status,
    message: error.message || httpStatus[status],
  };

  if (
    req.app.get('env') !== 'production' &&
    status >= httpStatus.INTERNAL_SERVER_ERROR
  ) {
    response.stack = error.stack;
    logger.error(`${error.name}:`, error);
  }

  res.status(status);
  res.json(response);
});

module.exports = app;
