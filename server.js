
// var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database('Users', createTableUsers);
// var db_event = new sqlite3.Database('Events', createTableEvents);
var moment = require('moment');
// values = db.all("select * from users;", function(err, data) {
//         console.log(data); 
//         data2 = data;
//     });

// Connection URL
var url = 'mongodb://localhost:27017/lunch';
var http = require('http');
var fs = require('fs');
var mongoose = require('mongoose');
var date = moment().day(1).format('YYYYMMDD')
                

mongoose.connect(url);

var userSchema = new mongoose.Schema({
  'first_name': { type: String }
, 'last_name': String
, 'email': String
, 'team' : String
, 'active' : Boolean
});
var User = mongoose.model('users', userSchema);

var eventSchema = new mongoose.Schema({
  'date': { type: String }
, 'email1': String
, 'email2': String
, 'event_type' : String
, 'photo' : String
});

var Event = mongoose.model('events', eventSchema);

var datetime = new Date();
console.log(datetime);
http.createServer(function (req, res) {

    if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            var json = JSON.parse(data.toString())
            if(json.method == 'insert_user'){
                // insert_user(json.params[0],json.params[1],json.params[2],json.params[3])
                // console.log(db.run("select * from users;"))
                var new_user = new User({
                    'first_name': json.params[0],
                    'last_name': json.params[1],
                    'email': json.params[2],
                    'team': json.params[3],
                    'active': true
                })

                new_user.save(function(err, callb) {
                  if (err) return console.error(err);
                  console.dir(callb);
                  res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
                  //res.write(JSON.stringify(all))
                  res.end()
                });

            }
            else if(json.method == 'deactivate_user'){
                deactivate_user(json.params[0])
                res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
                //res.write("Set user inactive")
                res.end()
            }
            else if(json.method == 'activate_user'){
                activate_user(json.params[0])
                res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
                //res.write("Set user active")
                res.end()
            }
            else if(json.method == 'show_all_users'){
                // db.all("select * from users;",function show_all_users(err, all){
                //     res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
                //     res.write(JSON.stringify(all))
                //     res.end()
                // });
                User.find({}, function (err, user) {
                    res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
                    res.write(JSON.stringify(user))
                    res.end()
                });
            }
            else if(json.method == 'show_current_week_pairing'){
                Event.find({'date':date},
                    function show_current_week_pairing(err, all){
                        res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
                        res.write(JSON.stringify(all))
                        res.end()
                });
            }
            else if(json.method == 'update_photo') {
                // var stmt = db.prepare("UPDATE events SET photo=(?) where email1 = (?) or email2 = (?) and date = (?) ;", json.params[0],json.params[1],json.params[1], json.params[2]);
                // stmt.run(email);
                Event.findOne({
                    $and: [
                        { $or: [{'email1': json.params[1]}, {'email2': json.params[1]}] },
                        { 'date' : json.params[2] }
                    ]
                }, function(err, cb){
                    cb.photo = json.params[0]
                    cb.save(function(err, callb) {
                      if (err) return console.error(err);
                      console.dir(callb);
                      res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
                      //res.write(JSON.stringify(all))
                      res.end()
                    });
                })
            }
            else if(json.method == 'show_all_weeks_pairings'){
                Event.find({},
                    function show_current_week_pairing(err, all){
                        res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
                        res.write(JSON.stringify(all))
                        res.end()
                });
            }
        });
        

    }
    else{
      res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
      res.end("Get Request");
    }
}).listen(9615);

the_interval = 24 * 7 * 60 * 60 * 1000;
the_interval = 5 * 1000;
setInterval(function() {
  console.log("One week update lunches");
  calculate_new_pairing()
}, the_interval);

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// // Use connect method to connect to the Server
// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   console.log("Connected correctly to server");
//   db.createCollection("users", function(err, collection){
//     if (err) throw err;

//     console.log("Created testCollection");
//     console.log(collection);
//   });
//   db.close();
// });

// function createTableUsers() {
//     console.log("createTable users");
//     db.run("CREATE TABLE IF NOT EXISTS users (first_name char(50), last_name char(50), email char(100), team char(100), active INTEGER);");
// }

// function createTableEvents() {
//     console.log("createTable events");
//     db_event.run("CREATE TABLE IF NOT EXISTS events (date char(100), email1 char(100), email2 char(100), event_type char(200), photo char(200));");
// }



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
    // console.log("insertRows users");
    // var stmt = db.prepare("UPDATE users SET active=0 where email = (?);");
    // stmt.run(email);

    User.findOne({ 'email': email }, function (err, person) {
        if (err) return handleError(err);
        console.log(person)
        person.active = false
        person.save(function (err) {
            if (err) return handleError(err);
            console.log(person.email + " properly set inactive")
        });
    })

}

/*
    Activate user
*/
function activate_user(email) {
    // console.log("insertRows users");
    // var stmt = db.prepare("UPDATE users SET active=1 where email = (?);");
    // stmt.run(email);


    User.findOne({ 'email': email }, function (err, person) {
        if (err) return handleError(err);
        console.log(person)
        person.active = true
        person.save(function (err) {
            if (err) return handleError(err);
            console.log(person.email + " properly set active")
        });
    })

}

function do_majority_of_work(emails, _counter)
{
    if(_counter >= emails.length){
        return
    }
    this_user = emails[_counter]
    Event.findOne({
                $and: [
                    { $or: [{'email1': this_user}, {'email2': this_user}] },
                    { 'date' : date }
                ]
            }, function(err, exist_date){
                console.log(exist_date)
                if(exist_date == null){
                    simple_hash = {}
                    for(var i = 0; i < emails.length; i++){
                        simple_hash[emails[i]] = 0;
                    }
                    Event.find({
                        $or: [{'email1': this_user}, {'email2': this_user}]
                    }, function(err, previous_lunch_count){
                        console.log(previous_lunch_count)
                        for(var j = 0; j<previous_lunch_count.length; j++){
                            email1 = previous_lunch_count[j].email1;
                            email2 = previous_lunch_count[j].email2;
                            if(email1 == this_user.email){
                                simple_hash[email2] = simple_hash[email2] + 1;
                            }
                            else{
                                simple_hash[email1] = simple_hash[email1] + 1;
                            }
                        }

                        var min = 10000;
                        var return_email = null;
                        for (var email_keys in simple_hash){
                            if(simple_hash[email_keys] < min && this_user != email_keys){
                                min = simple_hash[emails];
                                return_email = email_keys;
                            }
                        }

                        // console.log(return_email);
                        if(return_email != null){
                            console.log(return_email)

                            var new_event = new Event({
                                'date': date,
                                'email1': return_email,
                                'email2': this_user,
                                'event_type': "Lunch",
                                'photo': "No Photo"
                            })

                            new_event.save(function(err, callb) {
                              if (err) return console.error(err);
                              console.dir(callb);
                              do_majority_of_work(emails, _counter+1)
                            });

                            // var stmt = db_event.prepare("INSERT into events VALUES (?,?,?,?,?);");
                            // stmt.run(date, email, return_email, "Lunch", "No_photo", function(err, qq){doSomething(_emails, counter + 1);});
                            // return
                            //db_event.all("select * from events;", function(err, qq){doSomething(emails, counter + 1);});
                        }
                        else{
                            // var stmt = db_event.prepare("INSERT into events VALUES (?,?,?,?,?);");
                            // stmt.run(date, email, "None This Week", "Lunch", "No_photo", function(err, qq){doSomething(_emails, counter + 1);});
                            var new_event = new Event({
                                'date': date,
                                'email1': this_user,
                                'email2': "None this week",
                                'event_type': "Lunch",
                                'photo': "No Photo"
                            })

                            new_event.save(function(err, callb) {
                              if (err) return console.error(err);
                              console.dir(callb);
                              do_majority_of_work(emails, _counter+1)
                            });

                        }
                        

                    })
                }
            });

}

function calculate_new_pairing(){

    
    var emails = [];

    User.find({'active':true}, function(err, all_users){
        for(var i = 0; i < all_users.length; i++){
            emails.push(all_users[i].email)
            
        }
        do_majority_of_work(emails, 0);
        var counter = 0;

        

    });

   

// function get_least_paired(current_user_email)
// {   
//     simple_hash = {}
//     db.all("select email from users;", function(e, a){
//         for(var x in a){
//             if(a[x].email != current_user_email.email){
//                 simple_hash[a[x].email] = 0;
//             }
//         }
//         var toRet = finish_calculations(simple_hash, current_user_email);
//     });
    
// }

// function finish_calculations(simple_hash, current_user_email){
//     var toRet;
//     db_event.all("SELECT email1,email2 from events where email1=(y) OR email2=(y);" , current_user_email.email, current_user_email.email,
//         function(err, stuff){
//             if(stuff != null){
//                 a = stuff.split('|');
//                 email1 = a[0];
//                 email2 = a[1];
//                 if(email1 == current_user_email.email){
//                     simple_hash[email2] = simple_hash[email2] + 1;
//                 }
//                 else{
//                     simple_hash[email1] = simple_hash[email1] + 1;
//                 }
//             }
//             toRet = final_calc(simple_hash, current_user_email);
            
//         });
//     return toRet;
// }

// function final_calc(simple_hash, current_user_email)
// {
//     var min = 10000;
//     var return_email = null;
//     for (var emails in simple_hash){
//         if(simple_hash[emails] < min && current_user_email.email != emails){
//             min = simple_hash[emails];
//             return_email = emails;
//         }
//     }
//     return return_email;

// }