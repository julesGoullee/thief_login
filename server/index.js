/*global require, exports*/
"use strict";
var app = require('express')(),
    server = require('http').createServer(app),
    _io = require("socket.io").listen(server);



function kernel(){
    _io.sockets.on("connection", function (socket) {
        socket.on("sendLogin", function(login){
            var addresse = socket.handshake.address.address;
            var text = "l'adresse " + addresse + " a envoyer les login :" + JSON.stringify(login);
            console.log(text);
        });
    });
}
kernel();
server.listen(8080);
//var regex = new RegExp("^((http|https):\/\/.*)\/.*");
//var test = "https://twitter.com/login";
//console.log(regex.test(test));
//var result = regex.exec(test);
//console.log(result);
//console.log(result[1]);