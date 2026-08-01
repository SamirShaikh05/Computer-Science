const fs = require('fs');

const readStream = fs.createReadStream('text/data.txt');
const writeStream = fs.createWriteStream('text/output.txt');

// readStream.on('data', (buffer)=>{
//     writeStream.write(buffer);
// })

readStream.pipe(writeStream);
