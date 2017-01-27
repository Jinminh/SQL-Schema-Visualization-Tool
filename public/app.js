

// // function connection(){
  
// // }
 window.onload = function(){
         // xmlhttprequest - get data from my connection endpoint or something
         // in the response make use of the data we've asked for
         var requestTables = new XMLHttpRequest()
         requestTables.onreadystatechange = function()
         {
             if (requestTables.readyState == 4)
             {
                 var details = "DONE HERE ARE MY DETAIL <br/>" + requestTables.responseText
                 document.getElementById("myDiagramDiv").innerHTML = details
             }
         }
         requestTables.open('GET', 'http://localhost:7474/tabledata', true)
         requestTables.send(null)
 }
