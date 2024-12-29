const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // null: 没有错误 true: 返回来源
      callback(null, true);
    } else {
      callback(new Error('Not allowed By CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;