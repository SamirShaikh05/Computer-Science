import express from "express";

const app = express();

// app.use((req,res,next)=>{
//     if(!req.query.age || req.query.age<18){
//         res.send("Alert ! You can not access this page");
//     }
//     else{
//         next();
//     }
// })

app.use((req,res,next)=>{
    const ip = req.socket.remoteAddress;
    console.log(ip);
    if (ip.includes("192.168.137.1")) {
    res.send("Alert ! You can not access this page");
  } else {
    next();
  }
})
app.get("/", (req, resp) => {
  resp.send("<h1>Home Page</h1>");
});

app.get("/login", (req, resp) => {
  resp.send("<h1>Login Page</h1>");
});

app.get("/admin", (req, resp) => {
  resp.send("<h1>Admin Page</h1>");
});

app.listen(3200);