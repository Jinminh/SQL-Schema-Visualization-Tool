var express = require("express");
var bodyParser = require("body-parser");
var mysql = require('mysql');
var fs = require('fs');

var app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

function val(someval){
  return someval;
}
// on load get connections from local file

app.get('/index.html', function(req, res){
  res.sendFile(__dirname + "/" + "index.html");
});

//app.use(express.static(__dirname + '/public'));

//get database information from client side
app.get('/process_get',function(req,res){
  response={
    hn:req.query.host,
    pn:req.query.port,
    db:req.query.db,
    un:req.query.user,
    pwd:req.query.pwd
  }

  //create connection parameters
  var conn = mysql.createConnection({
    host:response.hn,
    user:response.un,
    password:response.pwd,
    database:'information_schema',
    port:response.pn
  });
  
  var result;
  
  //create connection
  conn.connect(function(err) {
    if(err){
      console.error('error connecting ' + err.stack);
      res.redirect('public/index.html')
      return res.send(JSON.stringify(err));
      // might wanna redirect to home
    }
  });
  // after connection save to a local file
  fs.writeFile(__dirname + "/connection.txt", JSON.stringify(response),  function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});
  //search table names first 
  conn.query('SELECT TABLE_NAME FROM TABLES Where table_schema =?', [response.db],function(err,tables,fields){
    var jsonObj = [];
    
    console.log('connected');
    console.log('\n');
    if(err){
      return res.send(JSON.stringify(err));
    } 
   
    var count = 0;
    for (var i in tables) {    
        
        //according to table names, select columns for each table
        conn.query('SELECT COLUMN_NAME FROM `COLUMNS` WHERE TABLE_NAME = ?',[tables[i].TABLE_NAME], function(err, cols, fields){
          if(err){
            return res.send(JSON.stringify(err));
          }
          
          var item = {};
          item[' table'+count] = tables[count].TABLE_NAME;
          console.log('table'+count +':', tables[count].TABLE_NAME);
          
          for(var j in cols){
            console.log('cols'+j +':', cols[j].COLUMN_NAME);
            
//             conn.query('SELECT CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM `KEY_COLUMN_USAGE` WHERE TABLE_NAME=? AND COLUMN_NAME=?'
//                       , [tables[count].TABLE_NAME, cols[j].COLUMN_NAME], function(err, constraints, fields){
//               if(err){
//                 return res.send(JSON.stringify(err));
//               }
              
//               console.log('constraints'+':', cols[j], constraints[0].CONSTRAINT_NAME, constraints[0].REFERENCED_TABLE_NAME, constraints[0].REFERENCED_COLUMN_NAME);
//               console.log('\n');  
              
//             });
            
            
            item['col'+j] = cols[j].COLUMN_NAME;
          }
          
          count++;
          console.log('\n');
          jsonObj.push(item);
          if (count == Object.keys(tables).length){
           //res.render("process_get")
            //res.sendFile(__dirname+'\\public\\process_get.html');
            res.end(JSON.stringify(jsonObj));
          }
        });
    }
  });
  
  //res.end('connected');
  //conn.end();
})
        
       


var server = app.listen(7474, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log("Exa listening at http://%s:%s",host,port);
})




