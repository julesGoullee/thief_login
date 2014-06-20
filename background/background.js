/*global $,chrome*/

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if(request && request.from === "contentLogin" && request.login instanceof Array ) {
        var local_site = [];
        if(localStorage['site']){
            //recuperation des donnée dans le local storage
            local_site = JSON.parse(localStorage['site']);
            //recherche si le site existe deja
            var site_existe = false;
            $.each(local_site, function(iSite, site){
                if(sender.url === site.url){
                    local_site[iSite]['login'].push(request.login);
                    site_existe = true;
                    return false;
                }
            });
            // creation du site s'il n'exsite pas
            if(!site_existe){
                local_site.push({
                    'url': sender.url,
                    'login':[request.login]
                });
            }
        }
        else{
            //si aucune donnée local
            local_site.push({
                'url': sender.url,
                'login':[request.login]
            });
        }
        localStorage['site'] =JSON.stringify(local_site);
    }
});