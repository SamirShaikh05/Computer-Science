const fs = require('fs');

let readStream = fs.createReadStream('text/data.txt');
let content = [];
readStream.on('data',(buffer)=>{
   content.push(buffer);
})

readStream.on('end', ()=>{
    let actualData = Buffer.concat(content).toString();
    console.log(actualData)
})