const whitelist = [
  'https://www.google.com',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:3500',
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      // null: 没有错误 true: 返回来源
      callback(null, true);
    } else {
      callback(new Error('Not allowed By CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;