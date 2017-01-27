
var tables
var displayedTable
 function loadList(tableobj)
 {
     var list = document.getElementById("myTableList")
     tables = {};
     for(i=0; i<tableobj.length; i++)
     {
         var item = document.createElement('li')
         item.appendChild(document.createTextNode(tableobj[i]["table"+i]))
         item.addEventListener("click", addTable, false);
         var obj = [];
         for(j=0; j<Object.keys(tableobj[i]).length-1; j++)
         {
             obj[j] = tableobj[i]['col'+j]
         }
         tables[tableobj[i]["table"+i]] = obj
         list.appendChild(item)
     }
     
 }
 
 function addTable(event) {
    var dataValue = event.target.firstChild.nodeValue; // value of TextNode created by elements.createTextNode(Data)
    // handle dataValue
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
 

