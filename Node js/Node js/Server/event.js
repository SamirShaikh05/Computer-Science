const events = require('events');
const {EventEmitter} = events;
const fs = require('fs');

eventEmitter = new EventEmitter();

eventEmitter.on("event-1", function(content){
    fs.writeFile('text/content.txt', content, (err)=>{
     if(err) console.log("error while creating file");
     else console.log("file created");
    })
})

module.exports = eventEmitter;