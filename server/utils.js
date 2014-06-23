/*global exports*/
"use strict";
//modules node js
var mysql =  require('mysql');

function Foreach (array,callback){
    var i;
    for(i in array){
        if(array.hasOwnProperty(i)){
            if(callback(parseInt(i,10),array[i]) ==="stop"){
                return ;
            }
        }
    }
}

function Orm() {
    var self = this;

    var connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "query*"
    });



    self.init = function() {
        connection.config.queryFormat = function (query, values) {
            if (!values) return query;
            return query.replace(/\:(\w+)/g, function (txt, key) {
                if (values.hasOwnProperty(key)) {
                    return this.escape(values[key]);
                }
                return txt;
            }.bind(this));
        };
        connection.connect();
        connection.query("use thief_login");
        return self;
    };

    self.query = function(query, params,  callback){
        connection.query(query, params, function(err, data){
            if( callback ) {
                callback(data, err);
            }
        });
    };
}

exports.foreach = function(array,callback){
    return new Foreach(array,callback);
};

exports.orm = function(){
    return new Orm().init();
};

