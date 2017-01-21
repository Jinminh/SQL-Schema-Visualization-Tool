var express = require("express");
var bodyParser = require("body-parser");
var mysql = require('mysql');

var app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

function val(someval){
  return someval;
}

app.get('/index.html', function(req, res){
  res.sendFile(__dirname + "/" + "index.html");
});

app.post('/data', function(req, res) {
  console.log("post to data!");
  
  var conn = mysql.createConnection({
    host:req.body.hostname,
    user:req.body.username,
    password:req.body.password,
    database:req.body.db,
    port:req.body.portnumber
  });
  
  conn.connect(function(err) {
    if(err){
      console.error('error connecting ' + err.stack);
      return;
    }
    
    console.log('connected as id' + connection.threadId);
  });
  
})

app.get('/process_get',function(req,res){
  console.log("Got a click!");
  response={
    hn:req.query.host,
    pn:req.query.port,
    db:req.query.db,
    un:req.query.user,
    pwd:req.query.pwd
  }
  //console.log(response);
  
  var conn = mysql.createConnection({
    host:response.hn,
    user:response.un,
    password:response.pwd,
    database:response.db,
    port:response.pn
  });
  
  var result;
  
  conn.connect();
  
  conn.query('SELECT 1+1 AS solution', function(err,rows,fields){
    if(err){
      return res.send(JSON.stringify(err));
    } 
    
    console.log('>>>>>',rows[0].solution);
    result = rows[0].solution;
    res.send('conneted');
  });
  
  //res.end('connected');
  //conn.end();
})
        
       


var server = app.listen(7474, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log("Exa listening at http://%s:%s",host,port);
})




// var connection = mysql.createConnection({
//   host: 'test.ci9et1hjxavg.us-west-2.rds.amazonaws.com',
//   user: 'root',
//   password: 'testdbpwd',
//   database: 'testdb'
// });

// connection.connect();

// connection.query('SELECT 1+1 AS solution', function(err, rows, fields){
//   if(err)
// //     throw err;
//     console.log(err);
//   console.log('solution is: ', rows[0].solution);
// });

