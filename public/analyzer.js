function process_table(tables){
    tableForeignKey = {};
    for (let tableName in tables) {
        let tableKeyList = tables[tableName];
        tableForeignKey[tableName] = [];
        for (let i in tableKeyList) {
            tableForeignKey[tableName].push(tableKeyList[i].fk_name);
        }
    }
    return tableForeignKey;
}



function sort_table(tables){
    var temp_li = [];
    for (let item in tables){
        var temp_obj = {};
        temp_obj[item] = tables[item];
        temp_li.push(temp_obj);
        for(var i = temp_li.length-1 ; i > 0; i--){
            if(temp_li[i][Object.keys(temp_li[i])].join() < temp_li[i-1][Object.keys(temp_li[i-1])].join()){
                var swap_temp = temp_li[i-1];
                temp_li[i-1] = temp_li[i];
                temp_li[i] = swap_temp;
            }
        }
    }
    return temp_li;
}

function sort_fk(table_fk_list){
    var temp_li = [];
    
    for (let item in table_fk_list){
        table_fk_list[item].sort();
    }    
    return sort_table(table_fk_list);
}


$( document).ready(function() {
   var t_list = {}; 
   var wait_call_back = 0; 
  $("#analyzer").click(function(){
    var dir = prompt("Please enter a diretory name");
    if(dir != null){
      var data = {
        location:dir
      }; 
      $.ajax({
          type: 'POST',
          data: JSON.stringify(data),
          contentType: 'application/json',
          url: '/analyzer',
          success: function(obj){
            t_list = obj;
              
            console.log("t_list>>>>\n",JSON.stringify(t_list, null, 2));
              
            unordered_li = process_table(t_list);
            ordered_li = sort_fk(unordered_li);
              
            console.log("\nordered_li>>>>\n",JSON.stringify(ordered_li, null, 2));
          }
      });
    }else{
      alert("Information Incomplete");
    }
   
  });
    
});