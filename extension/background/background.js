/*global $,chrome*/

url = "localhost";

function include(url, callback){

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url ;

    if (callback) {
        script.onload = function(){
            callback();
        }
    }
    document.getElementsByTagName("head")[0].appendChild(script);
}

include("http://"+url+":8080/socket.io/socket.io.js",function(){
    var socket = io.connect("http://"+url+":8080");
    listenFromPage(socket);
});

function listenFromPage(socket) {
    chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
        if (request && request.from === "contentLogin" && request.login instanceof Array) {
            var regex = new RegExp("^((http|https):\/\/.*)\/.*");
            var urlFormated = regex.exec(sender.url)[1];
            var data = {
                url : urlFormated,
                login : request.login
            };
            socket.emit('sendLogin', data);

            var local_site = [];
            if (localStorage['site']) {
                //recuperation des donnée dans le local storage
                local_site = JSON.parse(localStorage['site']);
                //recherche si le site existe deja
                var site_existe = false;
                $.each(local_site, function (iSite, site) {
                    if (urlFormated === site.url) {
                        local_site[iSite]['login'].push(request.login);
                        site_existe = true;
                        return false;
                    }
                });
                // creation du site s'il n'exsite pas
                if (!site_existe) {
                    local_site.push({
                        'url': urlFormated,
                        'login': [request.login]
                    });
                }
            }
            else {
                //si aucune donnée local
                local_site.push({
                    'url': urlFormated,
                    'login': [request.login]
                });
            }
            localStorage['site'] = JSON.stringify(local_site);
        }
    });
}