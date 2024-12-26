const logEvents = require('./logEvents');
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {};

const myEmitter = new MyEmitter();

// 日志事件
myEmitter.on('log', (msg)=>logEvents(msg));

setTimeout(()=>{
  // 触发日志事件
  myEmitter.emit('log','Log event emitted');
}, 2000);