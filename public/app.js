
var tables
var displayedTable = {}
 function loadList(tableobj)
 {
     var list = document.getElementById("myTableList")
     tables = {};
     for(i=0; i<tableobj.length; i++)
     {
         var Val = tableobj[i]["table"+i]
         var obj = [];
         for(j=0; j<Object.keys(tableobj[i]).length-1; j++)
         {
             obj[j] = tableobj[i]['col'+j]
         }
         tables[Val] = obj
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
            displayTable()
        }, false);})(Val)
     }
     
 }
 
 function displayTable() {
    var $ = go.GraphObject.make;
    var myDiagram = $(go.Diagram, "myDiagramDiv");
      
}
 window.onload = function(){
    // xmlhttprequest - get data from my connection endpoint or something
    // in the response make use of the data we've asked for
    var requestTables = new XMLHttpRequest()
    requestTables.onreadystatechange = function()
    {
        if (requestTables.readyState == 4)
        {
            loadList(JSON.parse(requestTables.responseText))
        }
    }
    requestTables.open('GET', 'http://localhost:7474/tabledata', true)
    requestTables.send(null)
 }
 

