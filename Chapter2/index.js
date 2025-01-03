// const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const fileOps = async ()=>{
  try {
    const data = await fsPromises.readFile(path.join(__dirname,'files','starter.txt'),'utf-8');
    console.log(data);
    await fsPromises.unlink(path.join(__dirname,'files','starter.txt'));

    await fsPromises.writeFile(path.join(__dirname,'files','promiseWrite.txt'), 'Nice to meet you');
    console.log('Write complete');
    await fsPromises.appendFile(path.join(__dirname,'files','promiseWrite.txt'), '\n\nYes');
    console.log('Append complete');
    await fsPromises.rename(path.join(__dirname,'files','promiseWrite.txt'), path.join(__dirname,'files','promiseComplete.txt'));
    console.log('Rename complete');
    const newData = await fsPromises.readFile(path.join(__dirname,'files','promiseComplete.txt'),'utf-8');
    console.log(newData);
  }catch(err){
    console.error(err);
  }
}

fileOps();

/*
fs.readFile(path.join(__dirname,'files','starter.txt'), 'utf-8', (err, data)=>{
    if(err) throw err;
    console.log(data);
});

fs.writeFile(path.join(__dirname,'files','reply.txt'), 'Nice to meet you', (err)=>{
  if(err) throw err;
  console.log('Write complete');

  fs.appendFile(path.join(__dirname,'files','reply.txt'), '\n\nYes', (err)=>{
    if(err) throw err;
    console.log('Append complete');

    fs.rename(path.join(__dirname,'files','reply.txt'), path.join(__dirname,'files','newreply.txt'), (err)=>{
      if(err) throw err;
      console.log('Rename complete');
    });
  });
});
*/

process.on('uncaughtException', err=>{
  console.error(`There was an uncaught error: ${err}`);
  process.exit(1);
})