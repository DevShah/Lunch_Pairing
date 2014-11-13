
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('Users', createTable);

values = db.all("select * from users;", function(err, data) {
        console.log(data); 
        data2 = data;
    });

var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {

    if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            var json = JSON.parse(data.toString())
            console.log(json);
        });
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end("Post Request");
    }
    else{
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end("Get Request");
    }
}).listen(9615);

 the_interval = 24 * 7 * 60 * 60 * 1000;
setInterval(function() {
  console.log("One week update lunches");
  // do your stuff here
}, the_interval);

function createTable() {
    console.log("createTable users");
    db.run("CREATE TABLE IF NOT EXISTS users (first_name char(50), last_name char(50), email char(100), team char(100));");
}

function insert_User(first_name, last_name, email, team) {
    console.log("insertRows users");
    var stmt = db.prepare("INSERT INTO users VALUES (?,?,?,?)");
    stmt.run(first_name, last_name, email, team);
}

function delete_User(email) {
    console.log("insertRows users");
    var stmt = db.prepare("DELETE from Users where email = (?);");
    stmt.run(email);
}

