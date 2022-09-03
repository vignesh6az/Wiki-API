const express = require("express");
const ejs = require("ejs");
const bodyParser= require("body-parser");
const mongoose = require("mongoose");
const { title } = require("process");
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});

const app=express();
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

const articleSchema = {
    title:String,
    content:String
};

const Article = mongoose.model("Article",articleSchema);


/////request targeting all articles////
app.route("/articles")

.get(
    function(req,res){
        Article.find(function(err, foundArticles){
            if(!err){
                res.send(foundArticles);
            }else{
                res.send(err);
            }
            //console.log(foundArticles);
        });
    })


.post(
    function(req,res){
        const newArticle = new Article({
            title:req.body.title,
            content:req.body.content
        });
        newArticle.save(function(err){
            if(!err){
                res.send("successfully added a new article");
            }else{
                res.send(err);
            }
       });
    })


.delete(
    function(req,res){
        Article.deleteMany(function(err){
            if(!err){
                res.send("Successfully deleted all Articles");
            }else{
                res.send(err);
            }
        });
    });


    /////request targeting specific article////

app.route("/articles/:articleTitle")

.get(function(req,res){

    Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No article matching the title was found")
        }
    });
})

.put(function(req,res){
    Article.replaceOne(
        {title:req.params.articleTitle},
        {title:req.body.title, content:req.body.content},
        //{overwrite:true},
        function(err){
            if(!err){
                res.send("Successfully updated article");
            }
        });
})

.patch(function(req,res){
    Article.updateOne(
        {title:req.params.articleTitle},
        {$set : req.body},
        function(err){
            if(!err){
                res.send("Successfully updated article"); 
            }else{
                res.send(err);
            }
        }
    );
})

.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Successfully deleted article"); 
            }else{
                res.send(err);
            }
        }
        
    );
});







app.listen(3000,function(){
    console.log("server started on port 3000");
});