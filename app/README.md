# Running the server
To run the server, use `$ npm start`. However, you need to first set up the environment variables.

###Setting up environment variables
If you look in server.js, you'll notice there are several references to environment variables. These include 
* `MONGOPORT`
* `MONGOUSER`
* `MONGOPASSWORD`
* `APPNAME`
* `MONGOIP`

Before starting the server, you'll need to export the proper values to your environment using `$ export VARNAME=<VAL>`. The server should run properly after exporting all of those variable values.