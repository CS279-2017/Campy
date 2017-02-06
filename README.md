# Campy

##Drive Link with Mockups/Assets
```
https://drive.google.com/open?id=0ByOASNxoiv63OEFNbFI5WFQwcDQ
```

##To Run
Make sure an instance of mongodb is running. You may need to update app/server/server.js to reach the correct endpoint.
```
cd app
npm start
```
go to 
```
localhost:8080
```
##Hierarchy
```
App
-Client
--main.js
--routes.js //contains all clientside routing info
--modules
---ModuleName.js //contains each page module convention "Uppercase.js"
-Public //any publicly available assets
---css //all client-side css files. Module specific css will be "modulename.css" all lower 
---js //all client-side js files. Module specific js will be "modulename.js" all lower
---img //all images
-Server
--models //mongo models
--modules
--server.js // server-side routing
```
