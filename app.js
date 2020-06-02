var express   =require("express"),
    expressSanitizer = require('express-sanitizer'),
    mongoose  =require("mongoose"),
    methodOverride=require("method-override"),
    bodyParser=require("body-parser"),
app=express();

//APP CONFIG
mongoose.connect("mongodb://localhost/blog_app",{useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


//MONGOOSE/MODEL CONFIG
var blogSchema=new mongoose.Schema({
    title  : String,
    image  : String,
    body   : String,
    created: {type : Date, default :Date.now}
});

var Blog=mongoose.model("Blog",blogSchema);

// Blog.create({
//     title:"Test Blog",
//     image:"https://images.unsplash.com/photo-1542435503-956c469947f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     body: "Hello there! This is my blog post"
// });


//ROUTES
app.get("/",function(req,res){
    res.redirect("/blogs");

});
//INDEX ROute
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("ERROR!");
        }else{
            res.render("index",{blogs : blogs});
        }

    });
});

//NEW ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs",function(req,res){

    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }

    });


});


//Show Route
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
           if(err){
               res.redirect("/blogs");
           }else{
               res.render("show",{blog : foundBlog})
           }
    })

});



//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog : foundBlog});
        }
    })
   
});

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
       if(err){
           res.redirect("/blogs");
       }else{
           res.redirect("/blogs/"+req.params.id);
       }

   });

});

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
});


app.listen(3000,function(){
    console.log("Blog App Has Started!")

});
    