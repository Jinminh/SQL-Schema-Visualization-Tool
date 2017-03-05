 function loadList(tableobj){
     var list = document.getElementById("myTableList");
     tables = {};
     for(var i=0; i<tableobj.length; i++){
         var Val = tableobj[i]["table"+i]
         var obj = [];
         for(var j=0; j<Object.keys(tableobj[i]).length-1; j++)
         {
             obj[j] = tableobj[i]['col'+j]
         }
         tables[Val] = obj
         tables[Val].referencedTables = [];
       
         //alert("Val: "+Val+" tables[Val]: "+ tables[Val]);
     }
        for(var i=0; i<tableobj.length; i++){
          var Val = tableobj[i]["table"+i];
          
          var keys = Object.keys(tables[Val]);
       //alert("keys:"+keys);
          for(var j=0; j<Object.keys(tables[Val]).length-1; j++){
          if(tables[Val][j]['referenced_table_name'] !== null && tables[Val][j]['referenced_table_name'] !== undefined){
              if($.inArray(tables[Val][j]['referenced_table_name'], tables[Val].referencedTables) == -1)
                    tables[Val].referencedTables.push(tables[Val][j]['referenced_table_name']);
              if($.inArray(Val, tables[tables[Val][j]['referenced_table_name']].referencedTables) == -1)
                    tables[tables[Val][j]['referenced_table_name']].referencedTables.push(Val);
             }
         }
         var newLi = document.createElement('a');
         newLi.appendChild(document.createTextNode(Val));
         list.appendChild(newLi);
          
//          alert(list);
         (function(value){
            newLi.addEventListener("click", function() {
              
            if(displayedTable[value] !== undefined)
            {
                delete displayedTable[value];
            }
            else
            {
                displayedTable[value] = tables[value];
                //alert("im tables value>>>"+ JSON.stringify(tables[value]));
            }
            displayTable(displayedTable)
        }, false);})(Val)
     }
     
 }

function OrderAscPk(){
  var unordered_li = [];
  var ordered_li = [];
  
  /*add entities and their primary keys into unordered_li*/
  for(var key in tables){
    if(tables.hasOwnProperty(key)){
      var count = 0;
      
      /*create an object contains {entity_name:list_of_primary_keys[]}*/
      var primary_key_obj = {};
      
      /*create list_of_primary_keys[]*/
      var primary_key_list = [];
      
      /*append primary keys into list_of_primary_keys[]*/
      for(var item in tables[key]){
        if(typeof(tables[key][item].constrain_name) != 'undefined'){
          if(tables[key][item].constrain_name=='PRIMARY'){
            var temp = tables[key][item].name;
            //console.log(temp);
            primary_key_list.push(temp);

          }                  
        }
      }
      
      /*append object{entity_name:list_of_primary_keys[]} into unordered_li*/
      if(primary_key_list.length != 0){
        primary_key_list.sort();
        primary_key_obj[key]=primary_key_list;
        unordered_li.push(primary_key_obj);
      }           
    }
  } 
  
  /*push item into ordered_li and sort items*/ 
  for(var item=0; item< unordered_li.length; item++){
    /*push item from unordered_li */
    ordered_li.push(unordered_li[item]);
    
    /*compare primary key alphbetically and swap*/
    for(var i=ordered_li.length-1; i>0;i--){
      //console.log("im in second for");
      var end_loop = 0;  
      var j=0;
      /*There is a list of primary keys which is possible to compare several elements*/
      for(;;){
        if(ordered_li[i][Object.keys(ordered_li[i])][j] > ordered_li[i-1][Object.keys(ordered_li[i-1])][j]){
          end_loop = 1;
          break;
        }else if(ordered_li[i][Object.keys(ordered_li[i])][j] < ordered_li[i-1][Object.keys(ordered_li[i-1])][j]){
          var temp = ordered_li[i-1];
          ordered_li[i-1]=ordered_li[i];
          ordered_li[i] = temp;
          break;
        }else{
          if(j==ordered_li[i-1][Object.keys(ordered_li[i-1])].length-1){
            end_loop = 1;
            break;
          }else if(j==ordered_li[i][Object.keys(ordered_li[i])].length-1){
            var temp = ordered_li[i-1];
            ordered_li[i-1]=ordered_li[i];
            ordered_li[i] = temp;
            break;
          }else{
            j++;
            continue;
          }
        }
        j++;
      }    
      if(end_loop == 1){
        break;
      }
    }
  }
  return [ordered_li,unordered_li];
}

function pk(primary_key_list){
  return primary_key_list[Object.keys(primary_key_list)];
}

function check_identical_array(arr1, arr2){
  if(arr1.length != arr2.length){
    return false;
  }else{
    for(var i=0; i<arr1.length;i++){
      if(arr1[i] != arr2[i]){
        return false;
      }
    }
  }
  return true;
}

function remove_from_list(item, list){
  for(var i=0; i<list.length;i++){
    if(JSON.stringify(Object.keys(item)) == JSON.stringify(Object.keys(list[i]))){
      list.splice(i,1);
      break;
    }
  }
}

function arr_intersection(arr1, arr2){
  var a = 0, b = 0;
  while(a < arr1.length && b < arr2.length){
    if(arr1[a] < arr2[b])
      a++;
    else if(arr1[a] > arr2[b])
      b++;
    else{
      return true;
    }
   }
  return false;
}


/*Implement the algorithm*/
function cluster_func(ordered_rels, remaining_rels, cluster,nes){
  /*step 1 and 2*/
  var disjoint = false;
  cluster[0] = ordered_rels[0];
  remove_from_list(cluster[0], remaining_rels);
  for(var i=1; i<ordered_rels.length; i++){
    var r = ordered_rels[i]; 
    if(check_identical_array(pk(r),pk(cluster[nes-1]))){
      cluster[nes] = r;
      nes++;
      remove_from_list(r,remaining_rels);
    }else{
      disjoint = true;
      for(var j=0; j<nes; j++){
        if(arr_intersection(pk(r), pk(cluster[j]))){
          disjoint = false;
          break;
        }
      }
      if(disjoint === true){
        cluster[nes]=r;
        nes++;        
        remove_from_list(r, remaining_rels);
       // console.log("im c0>>>>>>222>>>"+ JSON.stringify(cluster[0]));
      }
    }
    
  }
  
  /*step 3*/
  var key_list = [];
  var remove_list = [];
  
  for(var i=0; i<cluster.length;i++){
    if(!key_list.includes(cluster[i][Object.keys(cluster[i])][0])){
      key_list.push(cluster[i][Object.keys(cluster[i])][0]);
    }
  }  
  
  for(var i=0; i< remaining_rels.length; i++){
    var li_push = 0;
    var j = 0;
    for(;;){
      var stop_loop = false;
      for(var k=0; k<key_list.length; k++){
        if(remaining_rels[i][Object.keys(remaining_rels[i])][j] == key_list[k]){
          li_push++;
          //console.log("im list_push "+li_push);
          if(li_push == 2){
            stop_loop = true;
            break;
          }
        }
      }
      if(stop_loop == true)
        break;
      j++;
      if(j>=remaining_rels.length)
        break;
    }
    
    if(li_push == 1){
      for(var cnt = 0;cnt < cluster.length; cnt++){
        if(cluster[cnt][Object.keys(cluster[cnt])][0] == remaining_rels[i][Object.keys(remaining_rels[i])][0]){
          cluster.splice(cnt,0,remaining_rels[i]);
          remove_list.push(remaining_rels[i]);
          break;
        }
      }
    }    
  }
  
  for(var i=0; i<remove_list.length; i++){
    remove_from_list(remove_list[i], remaining_rels);
  }

  
  /*step 4*/
  var ae_1 = [];
  var ae_2 = [];
  for(var i=0; i<cluster.length; i++){
    if(cluster[i][Object.keys(cluster[i])][0] == key_list[0])
      ae_1.push(cluster[i]);
    if(cluster[i][Object.keys(cluster[i])][0] == key_list[1])
      ae_2.push(cluster[i]);
  }
  
  
  var general_li=[];
  general_li.push(ae_1);
  general_li.push(ae_2);
  general_li.push(remaining_rels);
  return general_li;
}

 window.onload = function(){
    // xmlhttprequest - get data from my connection endpoint or something
    // in the response make use of the data we've asked for
    var requestTables = new XMLHttpRequest()
    requestTables.onreadystatechange = function()
    {
        if (requestTables.readyState == 4){
            
            setupDiagram();
            loadList(JSON.parse(requestTables.responseText));
            var res_li = OrderAscPk();
            var ordered_rels = res_li[0];
            //console.log("im orderedlist>>>>"+JSON.stringify(res_li[0]));
            
            var remaining_rels = res_li[1];
            var cluster = [];
            var nes = 1;
            
            
            var general_li = cluster_func(ordered_rels, remaining_rels, cluster, nes);
            var ae_1 = general_li[0];
            var ae_2 = general_li[1];
            var ar_1 = general_li[2];

            // for saving to database
            ae_summ1 = {}
            ae_summ2 = {}
            ar = {}
            var table1arr = []
            var table2arr = []
            var tablediamond = []
            // get data in desired format
            ae_1.forEach(function(element) {
                for(var name in element){
                table1arr.push({"name":name})
                }
            }, this);

            ae_summ1.data = table1arr
            ae_summ1.name = "ae1 temp name"

            ae_2.forEach(function(element) {
                for(var name in element){
                table2arr.push({"name":name})
                }
            }, this);

            ae_summ2.data = table2arr
            ae_summ2.name = "ae2 temp name"

            ar_1.forEach(function(element) {
                for(var name in element){
                tablediamond.push({"name":name})
                }
            }, this);

            ar.data = tablediamond
            ar.name = "ar temp name"
        }
    }
    requestTables.open('GET', '/tabledata', true)
    requestTables.send(null)
 }

