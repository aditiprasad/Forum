var express = require("express");
var app = express();
var fs = require("fs");
var ejs = require("ejs");
var bodyParser = require("body-parser");
var urlEncodedBodyParser = bodyParser.urlencoded({extended: false});

app.use(urlEncodedBodyParser);

var methodOverride = require("method-override");
app.use(methodOverride("_method"));

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("forum.db");

app.use(express.static('public'));


app.listen(3000, function(){
    console.log("Let's discuss on 3000");
});


app.get("/", function(req, res){
    db.all("SELECT * FROM threads", function(error, rows){
        if(error){
            console.log(error);
        } else {
            console.log(rows);
            var template = fs.readFileSync("views/index.html", "utf8");
            var rendered = ejs.render(template, {all : rows});
            res.send(rendered);  
        }
    }) 

});

app.post("/threads", function(req, res){
    var userNameThread = req.body.user_name_thread;
    var title = req.body.title;
    db.run("INSERT INTO threads (title, user_name_thread) VALUES(?,?)", title, userNameThread, function(error){
        if(error){
            console.log(error);
        } else {
            res.redirect("/")
        }
    })
});


app.get("/threads/:id", function(req, res){
    // console.log(req.params);
    var id = req.params.id;
    db.get("SELECT * FROM threads WHERE id=?", id, function(error, row){
        console.log()
        var thread = row;
        if(error){
            console.log(error);
        } else {
            db.all("SELECT * FROM comments WHERE thread_id=?", id, function(error, row){
                if(error){
                    console.log(error);
                } else {
                    var comments = row;
                    var template = fs.readFileSync("views/show.html", "utf8");
                    var rendered = ejs.render(template, {thread : thread, comments : comments});
                    res.send(rendered);
                }
            })

        }
    })
});



app.post("/threads/:thread_id/comments", function(req, res){
    db.get("SELECT id FROM threads", function(error, row){
        var threadId = row.id
        if(error){
            console.log(error);
        } else {
                var userName = req.body.user_name_comment;
                var entry = req.body.entry;
            db.run("INSERT INTO comments (entry, user_name_comment, thread_id) VALUES (?,?,?)", entry, userName, threadId, function(error){
                if(error){
                    console.log(error);
                } else {

                    res.redire("/");
                }
            })
        }
    })
})










