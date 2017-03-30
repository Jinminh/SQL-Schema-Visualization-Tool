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
            placeHolder = process_table(t_list);
            console.log(JSON.stringify(tableForeignKey, null, 2));  
          }
      });
    }else{
      alert("Information Incomplete");
    }
   
  });
    
});