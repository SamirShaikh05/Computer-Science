const fs = require('fs');
// fs.writeFileSync('files/apple.txt',"A apple a day keeps doctor away");
// fs.writeFileSync('files/banana.txt',"A banana a day keeps doctor away");
// fs.unlinkSync('files/banana.txt');
// const apple = fs.readFileSync('files/apple.txt', 'utf-8');
// console.log(apple);
// fs.appendFileSync('files/apple.txt',", Because this is very good for health");

const operation = process.argv[2];

if (operation === "Write") {
  const name = process.argv[3];
  const content = process.argv[4];
  fs.writeFileSync(`files/${name}.txt`, content);
  console.log("File Created");
}
else if (operation === "Read") {
  const name = process.argv[3];
  const data = fs.readFileSync(`files/${name}.txt`, "utf-8");
  console.log(data);
}

else if (operation === "update") {
  const name = process.argv[3];
  const content = process.argv[4];
  fs.appendFileSync(`files/${name}.txt`, content);
}

else if (operation === "delete") {
  const name = process.argv[3];
  fs.unlinkSync(`files/${name}.txt`);
}
