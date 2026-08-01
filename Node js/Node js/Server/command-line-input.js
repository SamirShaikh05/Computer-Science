const http = require('http');
const port = process.argv;

http.createServer((req, res)=>{
res.end("Hello  we are at port "+port[2])
}).listen(port[2])




