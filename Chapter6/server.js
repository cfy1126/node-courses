const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandle = require('./middleware/errorHandle');
const PORT = process.env.PORT || 3500;

// 自定义日志记录器中间件
app.use(logger);

// 允许跨域请求
const whitelist = [
  'https://www.google.com',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:3500',
  "extension://eggdlmopfankeonchoflhfoglaakobma"
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
app.use(cors(corsOptions));

// 解析 application/x-www-form-urlencoded 类型的请求体数据
app.use(express.urlencoded({ extended: false }));

// 解析 application/json 类型的请求体数据
app.use(express.json());

// 客户端可以直接访问 public 目录中的文件，而无需通过特定的路由处理器
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));

// 路由器
app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));
app.use('/employees', require('./routes/api/employees'));

// 处理所有未匹配路由的中间件（所有方法和路径）
app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({
      error: '404 Not Found',
    });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

// 错误处理中间件（记录错误日志）
app.use(errorHandle);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
