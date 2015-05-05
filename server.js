var express = require("express");
var path = require("path");
var Bourne = require("bourne");
var json = require('express-json')

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(json())

var posts = new Bourne("simpleBlogPosts.json");
var comments = new Bourne("simpleBlogComments.json");

app.get("/posts", function(req,res){
    posts.find(function(err,result){
        res.json(result)
    })
})

app.post("/posts", function(req,res){
    posts.insert(req.body, function(result){
        res.json(result);
    })
})

app.get("/*", function(req,res){
    posts.find(function(err,results){
    res.render("index.ejs", {posts: JSON.stringify(results)});
    })
})


var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});