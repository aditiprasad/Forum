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

//getting the root page


app.get("/", function(req, res){
    db.all("SELECT * FROM threads", function(error, rows){
        var data = rows;
        if(error){
            console.log(error);
        } else {
            // console.log(rows);
            db.all("SELECT * FROM threads ORDER BY likes DESC", function(error, rows){
                var likes = rows;
                if(error){
                    console.log(error);
                } else {
                    db.all("SELECT threads.title, threads.user_name_thread, threads.likes, COUNT (comments.count) AS total_comments FROM comments INNER JOIN threads ON comments.thread_id=threads.id GROUP BY threads.id ORDER BY comments.count DESC", function(error, rows){
                        var discuss = rows;
                        console.log(discuss);
                        var template = fs.readFileSync("views/index.html", "utf8");
                        var rendered = ejs.render(template, {all : data, popular : likes, discuss : discuss});
                        // console.log({discuss : discuss});
                        res.send(rendered);                          
                    });

                }
            });


        }
    }); 

});


//creating a new thread


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



//getting a particular thread, also showing the comments on that thread


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


//posting comments to a particular thread


app.post("/threads/:id/comments", function(req, res){
           var threadId = req.params.id;
           var count = req.body.count;
            var userName = req.body.user_name_comment;
            var entry = req.body.entry;
            var one = req.body.one;
            db.run("INSERT INTO comments (entry, user_name_comment, thread_id, count) VALUES (?,?,?,?)", entry, userName, threadId, parseInt(count) + parseInt(one), function(error){
                if(error){
                    console.log(error);
                } else {
                  console.log(threadId);
                  console.log(userName);
                  console.log(entry);
                    res.redirect("/threads/"+threadId);
                }
            });
})

//liking or voting on a thread


app.put("/threads/:id", function(req, res){
    var id = req.params.id;
    var thread_id = req.body.thread_id;
    var likes = req.body.likes;
    var vote = req.body.vote;
    db.run("UPDATE threads SET likes=? WHERE id=?", parseInt(likes) + parseInt(vote), thread_id, function(error){
        if(error){
            console.log(error);
        } else {
            console.log(req.params.thread_id);
             c
            res.redirect("/threads/"+id);
        }
    });
});






