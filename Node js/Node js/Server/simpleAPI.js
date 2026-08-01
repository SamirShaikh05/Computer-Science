const http = require('http');

const data = [
    {
        name: "Samir Shaikh",
        age: 19,
        email: "samir@test.com"
    },
    {
        name: "Aamir Shaikh",
        age: 23,
        email: "aamir@test.com"
    },
        {
        name: "Jabir Shaikh",
        age: 27,
        email: "jabir@test.com"
    },
        {
        name: "Zafer Shaikh",
        age: 32,
        email: "zafer@test.com"
    }
]

http.createServer((req, res)=>{
    res.setHeader("Content-Type", 'application/json')
    res.write(JSON.stringify(data));
    res.end();
}).listen(3000)     