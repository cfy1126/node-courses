const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

// 内置模块
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const logEvents = async (message, fileName) => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  console.log(logItem);
  try {
    if(!fs.existsSync(path.join(__dirname, '..', 'logs'))){
      fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
    }
    await fsPromises.appendFile(
      path.join(__dirname, '..', 'logs', fileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

const logger = (req, res, next)=> {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
  console.log(`${req.method} ${req.path}`);
  next();
}

module.exports = { logEvents, logger };
