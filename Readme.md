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
![Original image](demo_img/login.png?raw=true)

2. press save connection to create a local project
3. enter name and hit ok to save
4. press cancel to return without saving information
![Original image](demo_img/2.png?raw=true)

5. press select connection to view saved connections
6. select list item to populate connection strings
![Original image](demo_img/4.png?raw=true)

7. press connect to redirect to viewing page
8. if the connection fails, it will redirect to a error page, press Login Page button to return home page
![Original image](demo_img/5.png?raw=true)

9. click items from Advanced layout drop down to change layout of displayed entity tables
10. In the Tables drop down type in search bar to filter table list
![Original image](demo_img/6.png?raw=true)

11. select an item in the Tables drop down to update table display
12. clicking on an item when it isn't displayed will make the entity box appear in the display
13. clicking it when the item is displayed will make the entity box disappear from the display
14. click the arrow on the node will hide/show the attributes/details
![Original image](demo_img/7.png?raw=true)

15. click hide all entities to hide all entities
16. click show all entities to show all entities
![Original image](demo_img/8.png?raw=true)

17. click hide attributes to hide attributes on current view
18. click show attributes to show attributes on current view
19. click save layout to name and save current layout
![Original image](demo_img/9.png?raw=true)

20. click save layouts drop down to browse current saved layouts (may take a moment to update)
![Original image](demo_img/10.png?raw=true)

21. double clicking the header of the diagram in the low level view will update the diagram with related entities
22. clicking Export Diagram to Image will download a pdf version of the displayedn diagram
23. toggle the switch to switch between high and low level views
![Original image](demo_img/11.png?raw=true)

24. right click and select drill into on high level view to display er diagram of tables in high level node
25. right click and select rename to rename the current node in the high level view
![Original image](demo_img/12.png?raw=true)

26. click analyse and enter directory on server into the alert box to load analysed data, select tables/ switch in and out of summarized 
![Original image](demo_img/13.png?raw=true)

27. view to see new items(will be in blue)
![Original image](demo_img/14.png?raw=true)
