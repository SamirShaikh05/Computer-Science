import express from 'express'
const app = express();
const port = 3000;

function checkAgeRouteMiddleware(req, res, next){
    console.log(req.query.age);
    if(!req.query.age || req.query.age<18){
        res.send("Yoru are not allowed to use this website");
    }
    else next();
}

function checkUrl(req, resp, next) {
  console.log("this req url is " + req.url);
  next();
}

app.get("/", (req, resp) => {
  resp.send("<h1>Home page</h1>");
});

app.get("/login", checkUrl, (req, resp) => {
  resp.send("<h1>login page</h1>");
});

app.get("/users", checkAgeRouteMiddleware, checkUrl, (req, resp) => {
  resp.send("<h1>users page</h1>");
});

app.get("/products", checkAgeRouteMiddleware, checkUrl, (req, resp) => {
  resp.send("<h1>products page</h1>");
});

app.listen(port, ()=>{
    console.log(`App listening on port http://localhost:${port}`);
})