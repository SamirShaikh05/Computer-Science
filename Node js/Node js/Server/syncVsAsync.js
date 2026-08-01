// console.log("Apple1");
// setTimeout(() => {
//     console.log("Apple2");
// }, 0);
// console.log("Apple3");


// let a = 10;
// let b = 20;
// setTimeout(() => {
//     b = 100;
//     console.log(a+b);
// }, 0);

// console.log(a+b);


const fs = require('fs');
// fs.readFile('text/Aysha shaikh .txt', 'utf-8',(err, data)=>{
//     if(err) return false;
//     console.log(data);
// })
let data = fs.readFileSync('text/Aysha shaikh .txt', 'utf-8');
console.log(data);

console.log("end script");

