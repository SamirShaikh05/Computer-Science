const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
http.createServer((req, res) => {
    fs.readFile("form.html", 'utf-8', (err, data) => {
        if (err) {
            res.writeHead(500, { "content-type": "text/plain" });
            res.write("Internal Server Error");
            res.end();
        }
        res.writeHead(200, { "content-type": "text/html" })
        if (req.url == '/') {
            res.end(data);
        }
        else if (req.url == '/submit') {
            let dataBody = [];
            req.on('data', (chunk) => {
                dataBody.push(chunk);
            });
            req.on('end', () => {
                let rawData = Buffer.concat(dataBody).toString();
                let readableData = querystring.parse(rawData)
                let dataString ="My name is " +readableData.name +" and my email is " +readableData.email;
                
                // fs.writeFileSync('text/'+readableData.name+'.txt', dataString);
                fs.writeFile('text/'+readableData.name+'.txt', dataString, 'utf-8', (err)=>{
                    if(err){
                        console.error("Intenal Server Error");
                    }
                    else{
                        console.log("File created");
                    }
                });

                res.end(`
                    <h1>Form Submitted</h1>
                    <h2>${readableData.name}</h2>
                    <h2>${readableData.email}</h2>
                `)
            })
        }
    })
}).listen(3000);