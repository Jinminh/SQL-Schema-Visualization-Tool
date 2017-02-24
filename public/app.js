
var tables
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

 function hideall()
 {
   displayedTable = {}
   displayTable(displayedTable)
 }

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

 function loadList(tableobj)
 {
     var list = document.getElementById("myTableList")
     tables = {};
     for(var i=0; i<tableobj.length; i++)
     {
         var Val = tableobj[i]["table"+i]
         var obj = [];
         for(var j=0; j<Object.keys(tableobj[i]).length-1; j++)
         {
             obj[j] = tableobj[i]['col'+j]
         }
         tables[Val] = obj
         tables[Val].referencedTables = [];
     }
        for(var i=0; i<tableobj.length; i++)
     {
          var Val = tableobj[i]["table"+i]
          var keys = Object.keys(tables[Val])
          for(var j=0; j<Object.keys(tables[Val]).length-1; j++)
         {
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
          columns.push({"name":dataTable[keys[j]][i]['name']})
          if(dataTable[keys[j]][i]['referenced_table_name'] !== null && dataTable[keys[j]][i]['referenced_table_name'] !== undefined)
          {
              linkDataArray.push({"from":keys[j],'to':dataTable[keys[j]][i]['referenced_table_name']})
          }
      }
      nodeDataArray.push({"key":keys[j], "items":columns})
      console.log(dataTable[keys[j]])
    }
    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
      
}
 window.onload = function(){
    // xmlhttprequest - get data from my connection endpoint or something
    // in the response make use of the data we've asked for
    var requestTables = new XMLHttpRequest()
    requestTables.onreadystatechange = function()
    {
        if (requestTables.readyState == 4)
        {
            setupDiagram();
            loadList(JSON.parse(requestTables.responseText));
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
 

