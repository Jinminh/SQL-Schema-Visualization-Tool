var express = require("express");
var bodyParser = require("body-parser");
var mysql = require('mysql');
var fs = require('fs');
var crypto = require('crypto');
var execFile = require("child_process").execFile;
var util = require("util");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// add a get_data endpoint

//setup database
var nano = require('nano')('http://localhost:5984');
//nano.db.destroy('alice', function() { uncomment to reset database
nano.db.create('connection');
nano.db.create('layouts');
connection = nano.db.use('connection');
layouts = nano.use('layouts');
//});

var hash_conn;

function hash(str){
  var hashv = crypto.createHash('md5').update(str).digest('hex');
  return hashv;
}

app.get('/get_hash', function(req, res){
  res.send(hash_conn);
});

/*fectch layout data from couch db and send it to the front end*/
app.get('/get_layout', function(req,res){
  console.log('im here;');
  var i = 0;
  var list = [];
  layouts.list({include_docs:true},function(err, body){
    if(!err){
      body.rows.forEach(function(doc){
        console.log('im docs>>>>i '+i++);
        var item = doc.doc
//         alice.destroy(doc.id, doc.value.rev);
        console.log("\nim maybe data>>> "+ item.conn_name+": "+JSON.stringify(item.layout));
        if(item.conn_name == hash_conn)
          list.push({'name':item.name, 'layout': item.layout, 'state': item.state});
      });
    }
    res.send(list);
  });
  //console.log('im hererererererererererr');
  //console.log('/n/nlist>>>> '+list);
});

app.post('/analyzer', function(req, res){
  var path = req.body.location;
  console.log('\n' + path);
  var process = execFile('python', ["fk_extractor.py", path], (error, stdout, stderr) => {
     if(error){
         throw error;
     }
//      fk_info = JSON.parse(stdout)
     console.log(stdout)
  });
  
//   process.stdout.on('data', (data) => {
//     console.log(typeof data)
//     console.log(`${data}`);
//    });
//   fs.readdir(path, function(err,items){
//     if(err){
//       console.log('im err: '+ err.message);
//       res.send('directory not found');  
//     }else{
//       console.log(items);
//       for (var i=0; i<items.length; i++) {
//         console.log(items[i]);
//       }
//     } 
//   })
});


/*Fetch layout data front front end and send it to couchdb*/
app.post('/save_layout', function(req,res){
//   console.log('\ni am saveLayout-----------'+req.body.name+'\n');
  console.log('im hash conn in save: '+ hash_conn);
  var layout_info = req.body;
  layout_info['conn_name'] = hash_conn; 
  //console.log('im req.body>>>>'+JSON.stringify(layout_info));
  layouts.insert(layout_info, req.body.name, function(err, body, header){
    if(err){
      console.log('im err: '+ err.message);
      return;
    }
    console.log('you have inserted.');
    console.log(body);
  });
});


var TABLES = null;

//var conn_arr=[];

app.get("/tabledata", function(req, res) {
  console.log('im table>>>'+TABLES);
  res.send(TABLES);
})

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function removeDuplicates(arr) {
     var new_arr = [];
     var lookup  = {};
  
     new_arr.push(arr[0]);
     var first_key = Object.keys(new_arr[0])[0];
     var arr_first_key;
     var new_arr_first_key;

     //console.log('new>>>>'+Object.keys(new_arr[0])[0]);
     
     for(var i=1; i<arr.length;i++){
       var found = 0;     
       arr_first_key = Object.keys(arr[i])[0];
       for(var j=0; j<new_arr.length;j++){
         new_arr_first_key = Object.keys(new_arr[j])[0]
         if(arr_first_key == new_arr_first_key){
           found = 1;
           break;
         }
       }
       if(found === 0){
         new_arr.push(arr[i]);
       }
     }
     return new_arr;
}

app.get('/index.html', function(req, res){
  res.sendFile(__dirname + "/" + "index.html");
});


app.get('/get_connections', function(req,res){
  var conn_arr = [];
  //list through database
  connection.list({include_docs:true},function(err, body){
    if(!err){
      body.rows.forEach(function(doc) {
        conn_arr.push(doc.doc);
      });
      res.end(JSON.stringify(conn_arr));
    }
  });
});

//save connection through nano(couchdb)
app.post('/save_connection', function(req,res){
  console.log('save_connection: ' + req.body.conn_name);
  //search through database for the same item
  connection.list({include_docs:true},function(err, body){

    if(!err){
      //check if name already exists
      body.rows.forEach(function(doc) {
        if(doc.conn_name == req.body.conn_name)
        {
          return res.end('Connction name already exists!!!\nPlease re-enter a name');
        }
      });
      //insert body (null in place of id)
      connection.insert(req.body, null, function(err, body){
        return res.end('Could not save connection!!!\nPlease re-enter a name');
      })
    res.end('Connction Saved');
    }
  });
  res.end('Connction Saved');
});

app.get('/proceget',function(req,res){
 // console.log("im here>>>>>>>>"+JSON.stringify(req.query));
  console.log(">>>>>>>>");

  response={
    hn:req.query.host,
    pn:req.query.port,
    db:req.query.db,
    un:req.query.user,
    pwd:req.query.pwd
  }
  
  hash_conn = hash(JSON.stringify(response));
  console.log('im hash conn'+ hash_conn);
  //create connection parameters
  var conn = mysql.createConnection({
    host:response.hn,
    user:response.un,
    password:response.pwd,
    database:'information_schema',
    port:response.pn
  });
  
  //create connection
  conn.connect(function(err) {
    if(err){
      // might wanna redirect to home
      res.redirect('/error_page.html');
    }else{   
      var jsonObj = [];
      conn.query('SELECT TABLE_NAME FROM TABLES Where table_schema =?', [response.db],function(err,tables,fields){
        console.log('connected');
        console.log('\n');
        if(err){
          res.redirect('/error_page.html');
          //res.sendFile(__dirname + "/" + "error_page.html");
        } 


        /*Since the mysql query is a call back function
        All the variable below is for counting and make sure that 
        the program will execute the res.end() after all the queries finished*/

        //count the number of tables in the databse 
        var count = 0;

        //count the times of select contraints query execute
        var cnt = 0;    
        //the total number of columns in the database
        var col_cnt = 0;
        //count the column number in each table
        var temp_num = 0;
        console.log('2222>>>>>');
        for (var i in tables) {    
            //according to table names, select columns for each table
            conn.query('SELECT COLUMN_NAME, DATA_TYPE FROM `COLUMNS` WHERE TABLE_NAME = ?',[tables[i].TABLE_NAME], function(err, cols, fields){
              if(err){
                res.redirect('/error_page.html');
                //return res.send(JSON.stringify(err));
              }

              /*create items for jsonObj
              the format for each item is
              {
                "table":"table_name"
                "col0":{"column_name":"name", 
                "column_type":"type",
                "constrain_name":"con_name",
                "referenced_table_name":"ref_t_name",
                "referenced_column_name":"ref_col_name"}
                "col1": ...
                "col2": ...
                ...
               }
               */
              var item = {};
              item['table'+count] = tables[count].TABLE_NAME;
              console.log('table'+count +':', tables[count].TABLE_NAME);

              //count the total column number in the database
              for(var temp in cols){
                col_cnt++;
              }

              for(var j in cols){     

                //insert name and type to the column
                item['col'+j] = {name:cols[j].COLUMN_NAME, type:cols[j].DATA_TYPE}; 

                //according to the column names, select if there is any contraints for each column
                conn.query('SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM `KEY_COLUMN_USAGE` WHERE TABLE_NAME=? AND COLUMN_NAME=?'
                          , [item['table'+count], cols[j].COLUMN_NAME], function(err, constraints, fields){

                   if(err){
                     return res.send(JSON.stringify(err));
                   }

                  //if there is a constraints, add it to the column attributes
                  if(typeof constraints[0] != 'undefined'){         
                    console.log('constraints'+':', constraints[0].TABLE_NAME, constraints[0].COLUMN_NAME, constraints[0].CONSTRAINT_NAME, constraints[0].REFERENCED_TABLE_NAME, constraints[0].REFERENCED_COLUMN_NAME);
                    console.log('temp_num'+temp_num);
                    console.log(item['col'+temp_num]);

                    //insert constraint attributes to the column
                    item['col'+temp_num]['constrain_name'] = constraints[0].CONSTRAINT_NAME;
                    item['col'+temp_num]['referenced_table_name'] = constraints[0].REFERENCED_TABLE_NAME;
                    item['col'+temp_num]['referenced_column_name'] = constraints[0].REFERENCED_COLUMN_NAME
                    jsonObj.push(item);
                  }else{
                    jsonObj.push(item);
                  }

    //               console.log('temp_numhrererere>>>'+temp_num);
    //               console.log('col<>>>>>'+Object.keys(cols).length);

                  //reset the count of column number after finishing a table
                  if(temp_num == Object.keys(cols).length-1){
                    temp_num= -1;
                  }     
                  temp_num++;
                  console.log('\n')
                  cnt++;
                  //console.log('cnt>>>'+cnt);

                  //if all columns have been selected, res.send the jsonObj
                   if(cnt == col_cnt){
                      var final_obj = removeDuplicates(jsonObj);
                      console.log('res.send!!!');

                      //res.send(JSON.stringify(final_obj));
                      TABLES = JSON.stringify(final_obj);
                      //res.send(TABLES);
                      res.redirect("/process_get.html");
                    }
                });           
              }
              count++;
            });
        }
      });
    }
    
    
  });
  // after connection save to a local file  

});
  
var server = app.listen(7474, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log("Exa listening at http://%s:%s",host,port);
  //get_connections_from_file(__dirname+'/connection.json');
})





