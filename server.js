var express = require("express");
var path = require("path");
var Bourne = require("bourne");
var json = require('express-json');
var bodyParser = require('body-parser');

var app = express();

//bring in express modules
app.use(express.static(__dirname + '/public'));
app.use(json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//start fake database thing
var posts = new Bourne("simpleBlogPosts.json");
var comments = new Bourne("simpleBlogComments.json");


//routes
app.get("/posts", function(req,res){
    posts.find(function(err,result){
        res.json(result)
    })
})

app.post("/posts", function(req,res){
  console.log(req.body)
    posts.insert(req.body, function(result){
      //ERROR beginging here, we send the result back to be rendered, something wrong with the id
        res.json(result);
    })
})

app.get("/*", function(req,res){
    posts.find(function(err,results){
    res.render("index.ejs", {posts: JSON.stringify(results)});
    })
})



//server config
var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});