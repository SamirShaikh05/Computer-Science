const http = require('http');
const age = 19;
const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "text/html")
    res.write(
        `
        <html>
        <head>
        <title>My server</title>
        </head>
        <body>
        <h1>The HTML page server</h1>
        <h2>Hello My name is Samir Shaikh</h2>
        <h2>${age}</h2>
        <h2>${new Date()}</h2>
        </body>
        </html>
        `
    )
    res.end();   // Ending request
    // process.exit();  // This Stops the exectution after. and now we cannot get the response of the server
    
})
server.listen(4800);


// const server = http.createServer((req, res) => {
//     if(req.url=='/'){
//         res.write("<h1>Home Page</h1>")
//     }
//     else if(req.url == '/login'){
//         res.write("<h1>Login Page</h1>")
//     }
//     else{
//         res.write("<h1>Other Page</h1>")
//     }
//     res.end();
    
// })
// server.listen(4800);