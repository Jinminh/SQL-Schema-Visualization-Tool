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

function processToTableFormat(table){
    var tableLoad = {}
    for(elem in table){
        tableLoad[elem] = []
        table[elem].forEach(function(element) {
            var item = {}
            item.name = element.fk_name
            item.referenced_column_name = element.referenced_column_name
            tableLoad[elem].push(item)
            tableLoad[elem].referencedTables = []
        }, this);
        for(matchtable in table){
            if(matchtable !== elem)
            {
               table[elem].forEach(function(element) {
                   table[matchtable].forEach(function(match){
                       if(element.referenced_column_name == match.fk_name && tableLoad[elem].referencedTables.indexOf(matchtable) == -1){
                            tableLoad[elem].referencedTables.push(matchtable)
                       }
                   })
                }, this); 
            } 
        }
    }
    return tableLoad
}

function resetLists(loaded, selected){
    var loadedTables = [];
    var displayedLoadedTables = {};
    var list = document.getElementById("myTableList");

    var items = list.getElementsByTagName("li");
    for(var i=0; i< items.length;){
        if(displayedLoadedTables[items[i].value] !== undefined){
            list.removeChild(items[i])
        }
        else{
            i++;
        }
    }
}

function sort_table(tables){
    var temp_li = [];
    var remaining_li = [].concat(db_unordered_li);
    
    for (let item in tables){
        var temp_obj = {};
        temp_obj[item] = tables[item];
//         temp_li.push(temp_obj);
        remaining_li.push(temp_obj);
    }
    
    for (let item in remaining_li){
        temp_li.push(remaining_li[item]);
        for(var i = temp_li.length-1 ; i > 0; i--){
                if(temp_li[i][Object.keys(temp_li[i])].join() < temp_li[i-1][Object.keys(temp_li[i-1])].join()){
                    var swap_temp = temp_li[i-1];
                    temp_li[i-1] = temp_li[i];
                    temp_li[i] = swap_temp;
                }
            }
    }
    
    return [temp_li, remaining_li];
}

function loadTables(tab){
    var list = document.getElementById("myTableList");
    for(elem in tab){
            var newLi = document.createElement('a');
            newLi.appendChild(document.createTextNode(elem));
            list.appendChild(newLi);

            (function(value){
            newLi.addEventListener("click", function() {
                
            if(displayedLoadedTables[value] !== undefined)
            {
                delete displayedLoadedTables[value];
            }
            else
            {
                displayedLoadedTables[value] = loadedTables[value];
                //alert("im tables value>>>"+ JSON.stringify(tables[value]));
            }
            displayTable(displayedTable, displayedLoadedTables);
        }, false);})(elem)
    } 
//          alert(list);
    
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
            resetLists(loadedTables, displayedLoadedTables);  
            t_list = obj;

            loadedTables = processToTableFormat(t_list);

            loadTables(loadedTables);
              
            var unordered_li = process_table(t_list);          
           
            var return_li = sort_fk(unordered_li);
            var ordered_li = return_li[0];
            var remaining_li = return_li[1];
            
            var cluster = [];
            var nes = 1;
              
            var general_li = cluster_func(ordered_li, remaining_li, cluster, nes);
            var ae_1 = general_li[0];
            var ae_2 = general_li[1];
            var ar_1 = general_li[2];
              
            console.log("ae_1>>>\n"+JSON.stringify(ae_1));
            console.log("ae_2>>>\n"+JSON.stringify(ae_2));
            console.log("ar_1>>>\n"+JSON.stringify(ar_1));
              
          }
      });
    }else{
      alert("Information Incomplete");
    }
   
  });
    
});