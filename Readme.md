## Setup:

follow the steps in http://docs.couchdb.org/en/2.0.0/install/windows.html to run a couchdb database

install pip
```
sudo apt-get install python-pip
```
install simplejson
```
sudo pip install simplejson
```

open the terminal under the milestone1 folder and type
```
node test.js
```

go to localhost:7474 with chrome or other browsers

## Steps:
1. enter host name, port number, database name, username and password into appropriate inputs
2. press save connection to create a local project
3. enter name and hit ok to save
press cancel to return without saving information
press select connection to view saved connections
select list item to populate connection strings
press connect to redirect to viewing page
if the connection fails, it will redirect to a error page, press Login Page button to return home page
click items from Advanced layout drop down to change layout of displayed entity tables
In the Tables drop down type in search bar to filter table list
select an item in the Tables drop down to update table display
clicking on an item when it isn't displayed will make the entity box appear in the display
clicking it when the item is displayed will make the entity box dissapear from the display
click the arrow on the node will hide/show the attributes/details
click hide all entities to hide all entities
click show all entities to show all entities
click hide attributes to hide attributes on current view
click show attributes to show attributes on current view
click save layout to name and save current layout
click save layouts drop down to browse current saved layouts (may take a moment to update)
double clicking the header of the diagram in the low level view will update the diagram with related entities
clicking Export Diagram to Image will download a pdf version of the displayedn diagram
toggle the switch to switch between high and low level views
right click and select drill into on high level view to display er diagram of tables in high level node
right click and select rename to rename the current node in the high level view
click analyse and enter directory on server into the alert box to load analysed data, select tables/ switch in and out of summarized view to see new items(will be in blue)
