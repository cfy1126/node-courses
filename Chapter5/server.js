const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const logEvents = require('./logEvents');
const EventEmitter = require('events');
class Emitter extends EventEmitter {}
// 创建发射器对象
const myEmitter = new Emitter();
// 日志事件
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));

const PORT = process.env.PORT || 3500;

const serverFile = async (filePath, contentType, response) => {
  try {
    const rawData = await fsPromises.readFile(
      filePath,
      !contentType ? 'utf-8' : ''
    );
    const data =
      contentType === 'application/json' ? JSON.parse(rawData) : rawData;
    response.writeHead(filePath.includes('404.html') ? 404 : 200, {
      'Content-Type': contentType,
    });
    response.end(
      contentType === 'application/json' ? JSON.stringify(data) : data
    );
  } catch (err) {
    console.log(err);
    myEmitter.emit('log', `${err.name}\t${err.message}\n`, 'errLog.txt');
    response.statusCode = 500;
    response.end();
  }
};

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
  myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt');

  const extension = path.extname(req.url);
  let contentType;

  switch (extension) {
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.jpg':
      contentType = 'image/jpeg';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.txt':
      contentType = 'text/plain';
      break;
    default:
      contentType = 'text/html';
  }

  let filePath =
    contentType === 'text/html' && req.url === '/'
      ? path.join(__dirname, 'views', 'index.html')
      : contentType === 'text/html' && req.url.slice(-1) === '/'
      ? path.join(__dirname, 'views', req.url, 'index.html')
      : contentType === 'text/html'
      ? path.join(__dirname, 'views', req.url)
      : path.join(__dirname, req.url);

  if (!extension && req.url.slice(-1) !== '/') {
    filePath += '.html';
  }
  
  const fileExists = fs.existsSync(filePath);

  if (fileExists) {
    // 200 OK
    serverFile(filePath, contentType, res);
  } else {
    /*
    path.parse(filePath) 结果如下：
    {
      root: '/',
      dir: '/Users/cao/Desktop/node-courses/Chapter5',
      base: 'hello.js',
      ext: '.js',
      name: 'hello'
    }
  */

    switch (path.parse(filePath).base) {
      //301 重定向
      case 'old-page.html':
        res.writeHead(301, { Location: '/new-page.html' });
        res.end();
        break;
      case 'www.page.html':
        res.writeHead(301, { Location: '/' });
        res.end();
        break;
      default:
        //404 页面
        serverFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
    }
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));