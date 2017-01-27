var express = require("express");
var bodyParser = require("body-parser");
var mysql = require('mysql');
var fs = require('fs');

var app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// add a get_data endpoint

var TABLES = null;

app.get("/tabledata", function(req, res) {
  res.send(TABLES);
})

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
// on load get connections from local file

app.get('/index.html', function(req, res){
  res.sendFile(__dirname + "/" + "index.html");
});

//app.use(express.static(__dirname + '/public'));

//get database information from client side
app.get('/proceget',function(req,res){
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
  
  
var jsonObj = [];
    
  //search table names first 
  conn.query('SELECT TABLE_NAME FROM TABLES Where table_schema =?', [response.db],function(err,tables,fields){
    
    
    console.log('connected');
    console.log('\n');
    if(err){
      return res.send(JSON.stringify(err));
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
    for (var i in tables) {    
        //according to table names, select columns for each table
        conn.query('SELECT COLUMN_NAME, DATA_TYPE FROM `COLUMNS` WHERE TABLE_NAME = ?',[tables[i].TABLE_NAME], function(err, cols, fields){
          if(err){
            return res.send(JSON.stringify(err));
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
                  TABLES = JSON.stringify(final_obj)
                  res.redirect("http://localhost:7474/process_get.html")
                }
            });           
          }
          count++;
        });
    }
  });
  
})
              


var server = app.listen(7474, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log("Exa listening at http://%s:%s",host,port);
})




