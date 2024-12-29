const allowedOrigins = require('../config/allowedOrigins');

const credentials = (req, res, next)=>{
  const origin = req.headers.origin;
  if(allowedOrigins.includes(origin)){
    // 用于指示浏览器是否允许前端 JavaScript 代码在跨域请求中发送和接收凭证，true: 允许跨域请求携带凭证
    res.header('Access-Control-Allow-Credentials', true);
  }
  next();
}

module.exports = credentials;