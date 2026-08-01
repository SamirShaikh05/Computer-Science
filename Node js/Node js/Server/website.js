const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
    let collectHeaderData=fs.readFileSync("html/header.html", 'utf-8')
    let collectFooterData=fs.readFileSync("html/footer.html", 'utf-8')

    // fs.readFile("html/header.html", 'utf-8', (err, headerData) => {
    //     if (err) {
    //         res.writeHead(500, { "content-type": "text/plain" });
    //         res.end("Internal Server Error");
    //         return false;
    //     }
    //     collectHeaderData = headerData;
    // })

    // fs.readFile("html/footer.html", 'utf-8', (err, footerData) => {
    //     if (err) {
    //         res.writeHead(500, { "content-type": "text/plain" });
    //         res.end("Internal Server Error");
    //         return false;
    //     }
    //     collectFooterData = footerData;
    // })

    let file = req.url === '/' ? '/home' : req.url;

    if (req.url != '/style.css') {
        fs.readFile(`html${file}.html`, 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500, { "content-type": "text/plain" });
                res.end("Internal Server Error");
                return false;
            }
            res.writeHead(200, { "content-type": "text/html" });
            res.write(collectHeaderData+data+collectFooterData);
            res.end();
        })
    }
    else if (req.url == '/style.css') {
        fs.readFile("html/style.css", 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500, { "content-type": "text/plain" });
                res.end("CSS not found");
                return false;
            }
            res.writeHead(200, { "content-type": "text/css" });
            res.write(data);
            res.end();
        })
    }
}).listen(3000)