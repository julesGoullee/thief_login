/*global $, chrome*/

function setLogin() {
    console.log(localStorage['site']);
    var sites = JSON.parse(localStorage['site']);
    $.each(sites, function(iSite, site){
        var text_list = '<li class="site" ><span>- Site: <a href="' + site.url + '">' + site.url + '</a></span><ul class="logins">';
        $.each(site.login, function(iLogin, login){
            text_list += "<li class='one_login'><ul class='container_data'>";
            $.each(login, function(iData, data){
                text_list += '<li>' + data.name + ': ' + data.value + '</li>' ;
            });
            text_list += "</ul></li>";
        });
        text_list +='</ul></li>';
        $("#list_login").append(text_list);
    });
}

$(window).ready(function(){
    setLogin();
});
