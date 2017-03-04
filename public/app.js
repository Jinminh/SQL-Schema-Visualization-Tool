
var tables = [];
var displayedTable = {}


function filter() {
    // Declare variables
    var input, filter, ul, li, a, i;
    input = $('#myInput')
    filter = input[0].value.toUpperCase()
    ul = $("#myTableList")
    li = ul[0].getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i]
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

//hide all elements
 function hideall()
 {
   displayedTable = {}
   displayTable(displayedTable)
 }

//add all items to ist and show them
 function showall()
 {
   displayedTable = {}
   for (var key in tables) {
    if (tables.hasOwnProperty(key)) {
      displayedTable[key] = tables[key]
    }
  } 
   displayTable(displayedTable)
 }

 function loadList(tableobj){
     var list = document.getElementById("myTableList")
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
         var newLi = document.createElement('li');
         newLi.appendChild(document.createTextNode(Val));
         list.appendChild(newLi);
         (function(value){
            newLi.addEventListener("click", function() {
            if(displayedTable[value] !== undefined)
            {
                delete displayedTable[value]
            }
            else
            {
                displayedTable[value] = tables[value]
            }
            displayTable(displayedTable)
        }, false);})(Val)
     }
     
 }

 function expandTree(data){
   var reloadTable = false;
   displayedTable[data.key].referencedTables.forEach(function(element) {
     if(displayedTable[element] == undefined)
     {
       displayedTable[element] = tables[element]
       reloadTable = true;
     }
   }, this);
   if(reloadTable)
      displayTable(displayedTable)
 }
 
 function displayTable(dataTable) {
    // create the model for the E-R diagram
    var nodeDataArray = []
    var linkDataArray = []
    console.log('will our loop run?')
    var keys = Object.keys(dataTable)
    for(var j=0; j < keys.length; j++)
    {
      var columns = []
      for(var i=0; i < dataTable[keys[j]].length; i++)
      {
          columns.push({"name":dataTable[keys[j]][i]['name']});
          if(dataTable[keys[j]][i]['referenced_table_name'] !== null && dataTable[keys[j]][i]['referenced_table_name'] !== undefined)
          {
              linkDataArray.push({"from":keys[j],'to':dataTable[keys[j]][i]['referenced_table_name']})
          }
      }
      nodeDataArray.push({"key":keys[j], "items":columns})
    }
    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
      
}


function OrderAscPk(){
  var unordered_li = [];
  var ordered_li = [];
  
  /*add entities and their primary keys into unordered_li*/
  for(var key in tables){
    if(tables.hasOwnProperty(key)){
      //alert(key + " ->>>>>>>>>>>>>>>>>>>>>>>>>>>> " + JSON.stringify(tables[key]));
      //tables[key].push({"Primary_key_count":0});
      var count = 0;
      
      /*create an object contains {entity_name:list_of_primary_keys[]}*/
      var primary_key_obj = {};
      
      /*create list_of_primary_keys[]*/
      var primary_key_list = [];
      
      /*append primary keys into list_of_primary_keys[]*/
      for(var item in tables[key]){
        if(typeof(tables[key][item].constrain_name) != 'undefined'){
          if(tables[key][item].constrain_name=='PRIMARY'){
            //alert(key+">>>>>>>>>>>"+tables[key][item].name+">>>>>>>>>>>>"+tables[key][item].constrain_name);
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
    //console.log("im in for>>>"+ordered_li[0]);
    
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
            //console.log("im j>>>"+j);
           // console.log('im in else!!!'+ordered_li[i][Object.keys(ordered_li[i])][j] +"   "+ ordered_li[i-1][Object.keys(ordered_li[i-1])][j]);
            //console.log("im ordered_li[i]"+JSON.stringify(ordered_li[i-1])+"  "+JSON.stringify(ordered_li[i]));
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
  //console.log("im ordered>>>>>"+JSON.stringify(ordered_li));
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
    //console.log()
   // console.log("remaining_rels.keys>>>"+Object.keys(remaining_rels[i]));
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

function cluster_func(ordered_rels, remaining_rels, cluster,nes){
  /*step 1 and 2*/
  var disjoint = false;
  cluster[0] = ordered_rels[0];
  remove_from_list(cluster[0], remaining_rels);
  
  //console.log("im ordered_rels ?????? _______>>>"+ JSON.stringify(cluster[0]));
  //console.log("im remaining_rels>>>"+JSON.stringify(remaining_rels));
  //console.log("pk>>>>>>"+pk(ordered_rels[1]).length);
  for(var i=1; i<ordered_rels.length; i++){
    //console.log("im i>>>>>>"+i+"  "+JSON.stringify(ordered_rels[i]));
    var r = ordered_rels[i]; 
    //console.log("im nes>>>>"+nes+"im cluster>>>"+cluster[nes-1]);
    if(check_identical_array(pk(r),pk(cluster[nes-1]))){
      cluster[nes] = r;
      nes++;
      //console.log("im in the first if>>>>r is "+JSON.stringify(r)+ "ordered_rels is "+ JSON.stringify(cluster[nes-1]));
      remove_from_list(r,remaining_rels);
    }else{
      disjoint = true;
      for(var j=0; j<nes; j++){
        if(arr_intersection(pk(r), pk(cluster[j]))){
          //console.log("im disjoin>>>>"+JSON.stringify(r)+"im clustereed:"+JSON.stringify(cluster[j]));
          disjoint = false;
          break;
        }
      }
      if(disjoint === true){
        //console.log("im nes>>>"+ nes);
        //console.log("im c0>>>>>>111>>>"+ JSON.stringify(cluster[0]));
        cluster[nes]=r;
        nes++;
        
        //console.log("im in the second if>>>>r is "+ JSON.stringify(r)+ "ordered_rels is "+ JSON.stringify(ordered_rels[i-1]));
        remove_from_list(r, remaining_rels);
       // console.log("im c0>>>>>>222>>>"+ JSON.stringify(cluster[0]));
      }
    }
    
  }
//   console.log("im in remaining_rels>>>>item?>>>>"+JSON.stringify(remaining_rels));
  //console.log("im clustred>>>>"+JSON.stringify(cluster));
  
  /*step 3*/
  var key_list = [];
  var remove_list = [];
  
  for(var i=0; i<cluster.length;i++){
   // console.log(cluster[i][Object.keys(cluster[i])][0]);
    if(!key_list.includes(cluster[i][Object.keys(cluster[i])][0])){
      key_list.push(cluster[i][Object.keys(cluster[i])][0]);
    }
  }
  
  
  for(var i=0; i< remaining_rels.length; i++){
    //console.log("im in remaining_rels>>>>item?>>>>"+item);
    var li_push = 0;
    var j = 0;
    //console.log("im remain>>>"+ JSON.stringify(remaining_rels[i])+"  i>>>"+i);
    
    
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
  
  
  //console.log("after 3");
  //console.log("im in remaining_rels>>>>item?>>>>"+JSON.stringify(remaining_rels));
  //console.log("im clustred>>>>"+JSON.stringify(cluster));
  
  /*step 4*/
  var ae_1 = [];
  var ae_2 = [];
  for(var i=0; i<cluster.length; i++){
    if(cluster[i][Object.keys(cluster[i])][0] == key_list[0])
      ae_1.push(cluster[i]);
    if(cluster[i][Object.keys(cluster[i])][0] == key_list[1])
      ae_2.push(cluster[i]);
  }
  
//   console.log("ae1>>>>"+JSON.stringify(ae_1));
//   console.log("ae2>>>>"+JSON.stringify(ae_2));
  
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
            console.log("ae_1: "+ JSON.stringify(ae_1));
            console.log("ae_2: "+ JSON.stringify(ae_2));
            console.log("ar_1: "+ JSON.stringify(ar_1));
        }
    }
    requestTables.open('GET', '/tabledata', true)
    requestTables.send(null)
 }

 function base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var data = base64Data.substr(base64Data.indexOf(",") + 1)
    var byteCharacters = atob(data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
}
 
 function exportLocal( filename) {
   myDiagram.scale = 1;

    var imgBlob = myDiagram.makeImageData({
    scale:1,
    type: "image/png"
    });

    var a = document.createElement("a")
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(base64toBlob(imgBlob, "image/png"), filename);
    else { // Others
        var url = URL.createObjectURL(base64toBlob(imgBlob, "image/png"));
        a.href = url;
        a.download = "image/png";
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

//change selection
function onSelectionChanged(node) {
    myDiagram.centerRect(node.actualBounds);
  }

 function setupDiagram() {
    var $ = go.GraphObject.make;
    myDiagram = $(go.Diagram, "myDiagramDiv",
    {   initialContentAlignment: go.Spot.Center,
        allowDelete:false,
        allowCopy: false,
        layout: $(go.ForceDirectedLayout),
        "undoManager.isEnabled":true
    });
    
    var bluegrad = $(go.Brush, "Linear", { 0: "rgb(150,150,250)", 0.5:"rgb(86, 86, 186)", 1: "rgb(86, 86, 186)" });
    var greengrad = $(go.Brush, "Linear", { 0: "rgb(158, 209, 159)", 1: "rgb(67, 101, 56)" });
    var redgrad = $(go.Brush, "Linear", { 0: "rgb(206, 106, 100)", 1: "rgb(180, 56, 50)" });
    var yellowgrad = $(go.Brush, "Linear", { 0: "rgb(254, 221, 50)", 1: "rgb(254, 182, 50)" });
    var lightgrad = $(go.Brush, "Linear", { 1: "#E6E6FA", 0: "#FFFAF0" });
    
    // the template for each attribute in a node's array of item data
    var itemTempl =
      $(go.Panel, "Horizontal",
        $(go.TextBlock,
          { stroke: "#333333",
            font: "bold 14px sans-serif" },
          new go.Binding("text", "name"))
      );
    
     myDiagram.nodeTemplate =
      $(go.Node, "Auto",  // the whole node panel
        { selectionAdorned: true,
          selectionChanged: onSelectionChanged,
          resizable: true,
          layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides,
          isShadowed: true,
          shadowColor: "#C5C1AA" },
        new go.Binding("location", "location").makeTwoWay(),
        // define the node's outer shape, which will surround the Table
        $(go.Shape, "Rectangle",
          { fill: lightgrad, stroke: "#756875", strokeWidth: 3 }),
        $(go.Panel, "Table",
          { margin: 8, stretch: go.GraphObject.Fill },
          $(go.RowColumnDefinition, { row: 0, sizing: go.RowColumnDefinition.None }),
          // the table header
          $(go.TextBlock,
            {
              row: 0, alignment: go.Spot.Center,
              margin: new go.Margin(0, 14, 0, 2),  // leave room for Button
              font: "bold 16px sans-serif"
            },
            new go.Binding("text", "key")),
            { doubleClick: function(e, obj) { expandTree(obj.part.data); } },
          // the collapse/expand button
          $("PanelExpanderButton", "LIST",  // the name of the element whose visibility this button toggles
            { row: 0, alignment: go.Spot.TopRight }),
          // the list of Panels, each showing an attribute
          $(go.Panel, "Vertical",
            {
              name: "LIST",
              row: 1,
              padding: 3,
              alignment: go.Spot.TopLeft,
              defaultAlignment: go.Spot.Left,
              stretch: go.GraphObject.Horizontal,
              itemTemplate: itemTempl
            },
            new go.Binding("itemArray", "items"))
        )  // end Table Panel
      ); 
      
      // define the Link template, representing a relationship
    myDiagram.linkTemplate =
      $(go.Link,  // the whole link panel
        {
          selectionAdorned: true,
          layerName: "Foreground",
          reshapable: true,
          routing: go.Link.AvoidsNodes,
          corner: 5,
          curve: go.Link.JumpOver
        },
        $(go.Shape,  // the link shape
          { stroke: "#303B45", strokeWidth: 2.5 }),
        $(go.TextBlock,  // the "from" label
          {
            textAlign: "center",
            font: "bold 14px sans-serif",
            stroke: "#1967B3",
            segmentIndex: 0,
            segmentOffset: new go.Point(NaN, NaN),
            segmentOrientation: go.Link.OrientUpright
          },
          new go.Binding("text", "text")),
        $(go.TextBlock,  // the "to" label
          {
            textAlign: "center",
            font: "bold 14px sans-serif",
            stroke: "#1967B3",
            segmentIndex: -1,
            segmentOffset: new go.Point(NaN, NaN),
            segmentOrientation: go.Link.OrientUpright
          },
          new go.Binding("text", "toText"))
      );
      document.getElementById("layoutList").addEventListener("click", function(e){
        if(e.target && e.target.nodeName == "LI"){
          myDiagram.layout = $(go[e.target.id])
        }
      });
 }
 

