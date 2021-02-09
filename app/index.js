const createError = require('http-errors');
const httpStatus = require('http-status');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const logger = require('./utils/logger');
const config = require('config');
const APIError = require('./utils/APIError');

const routes = require('./routes');

mongoose.Promise = Promise;
mongoose.connect(config.get('db.uri'), {
  ...(config.has('db.options') && config.get('db.options')),
  useNewUrlParser: true,
  keepAlive: 1,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.enable('trust proxy');

if (process.env.NODE_ENV !== 'test') {
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

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  let convertedError = err;
  if (!(err instanceof APIError)) {
    convertedError = new APIError({
      message: err.message,
      status: err.status,
      stack: err.stack
    });
  }

  const response = {
    code: convertedError.status,
    message: convertedError.message || httpStatus[convertedError.status],
    errors: convertedError.errors
    // stack: convertedError.stack,
  };

  // if (req.app.get('env') !== 'development') {
  //   delete response.stack;
  // }

  res.status(convertedError.status);
  res.json(response);
});

module.exports = app;
