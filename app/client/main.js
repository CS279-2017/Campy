/* Copyright G. Hemingway, 2015 - All rights reserved */
"use strict";


// Necessary modules
require('./stylesheets/base.css');
require('bootstrap-webpack');
let Router          = require('./routes');
let io = require("socket.io-client");

/*************************************************************************/

// Primary App class
let App  = function() {
    this.room = '';
    // Establish the global URL router
    this.router = new Router({ app: this });
    Backbone.history.start({ pushState: true });
};

_.extend(App.prototype, Backbone.Events);

/*************************************************************************/

// Invoke the new app
module.exports = new App();