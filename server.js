
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('Users', createTableUsers);
var db_event = new sqlite3.Database('Events', createTableEvents);
var moment = require('moment');
// values = db.all("select * from users;", function(err, data) {
//         console.log(data); 
//         data2 = data;
//     });

var http = require('http');
var fs = require('fs');
var datetime = new Date();
console.log(datetime);
http.createServer(function (req, res) {

    if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            var json = JSON.parse(data.toString())
            if(json.method == 'insert_user'){
                insert_User(json.params[0],json.params[1],json.params[2],json.params[3])
                console.log(db.run("select * from users;"))
            }
            else if(json.method == 'deactivate_user'){
                deactivate_user(json.params[2])
            }
            else if(json.method == 'activate_user'){
                activate_user(json.params[2])
            }
            else if(json.method == 'show_all_users'){
                db.all("select * from users;",function show_all_users(err, all){
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.write(JSON.stringify(all))
                    res.end()
                });
            }
            else if(json.method == 'show_current_week_pairing'){
                date = moment().day(1).format('YYYYMMDD')
                db_event.all("SELECT * from events where date = (?)", date,
                    function show_current_week_pairing(err, all){
                        res.writeHead(200, {'Content-Type': 'text/plain'});
                        res.write(JSON.stringify(all))
                        res.end()
                });
            }
            else if(json.method == 'calculate_new_pairing') {
                calculate_new_pairing()
            }
            else if(json.method == 'show_all_weeks_pairings'){
                db_event.all("SELECT * from events",
                    function show_current_week_pairing(err, all){
                        res.writeHead(200, {'Content-Type': 'text/plain'});
                        res.write(JSON.stringify(all))
                        res.end()
                });
            }
        });
        

    }
    else{
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end("Get Request");
    }
}).listen(9615);

 the_interval = 24 * 7 * 60 * 60 * 1000;
setInterval(function() {
  console.log("One week update lunches");
  calculate_new_pairing()
}, the_interval);

function createTableUsers() {
    console.log("createTable users");
    db.run("CREATE TABLE IF NOT EXISTS users (first_name char(50), last_name char(50), email char(100), team char(100), active INTEGER);");
}

function createTableEvents() {
    console.log("createTable events");
    db_event.run("CREATE TABLE IF NOT EXISTS events (date char(100), email1 char(100), email2 char(100), event_type char(200), photo char(200));");
}



/*
    Insert user into the database

*/
function insert_user(first_name, last_name, email, team) {
    console.log("insertRows users");
    var stmt = db.prepare("INSERT INTO users VALUES (?,?,?,?,?)");
    stmt.run(first_name, last_name, email, team, 1);
}


/*
    Deactivate user
*/
function deactivate_user(email) {
    console.log("insertRows users");
    var stmt = db.prepare("UPDATE users SET active=0 where email = (?);");
    stmt.run(email);
}

/*
    Activate user
*/
function activate_user(email) {
    console.log("insertRows users");
    var stmt = db.prepare("UPDATE users SET active=1 where email = (?);");
    stmt.run(email);
}

function calculate_new_pairing(){

    var date = moment().format('YYYYMMDD')
    db_event.each("SELECT email from users",
            function blah(err, all){
                var email = all.email
                db.run("SELECT date from events where email1=(y) OR email2=(y);", function(err,data){
                    if()
                });

            });

}



