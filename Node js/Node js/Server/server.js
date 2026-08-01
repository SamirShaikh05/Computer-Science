const http = require('http');

http.createServer((req, res)=>{
    res.write("<h1>Hello this is samir shaikh</h1>");
    res.end("\nBye");
}).listen(3000);

http.createServer((req, res)=>{
    res.write("<h1>This is second server</h1>");
    res.end("\nBye");
}).listen(3200);