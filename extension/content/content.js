/*global $,chrome*/

$(document).ready(function(){

    var on_validate = function (inputs){
        var login = [];
        $.each(inputs, function(iInput, input) {
            login.push({
                'name': $(input).attr('name'),
                'value': $(input).val()
            });
        });
        chrome.runtime.sendMessage({
            'from': 'contentLogin',
            'login': login
        });
    };

    var recorded = function (form){
        var inputs = form.find('input');
        form.submit(function(){
            on_validate(inputs);
        });
        form.on('remove', function(){ on_validate(inputs);});
    };

    $('form').each(function(){
        var current_form = $(this);
        var current_inputs = $(this).find('input');
        // parcours les input  du form
        $.each(current_inputs, function(iInput, input){
            // si mot de passe alors enregistrement a la validation
            if( $(input).attr('type') === 'password'){
                recorded(current_form);
                return false;
            }
        });
    });

});
