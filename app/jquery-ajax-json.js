(function( $ ){
    if($.ajax.json) return;
    
    // query is optional
    // for 'get' only, the signature is function(verb, url, query)
    $.ajax.json = function(verb, url, query, payload) {
        if('get' != verb && arguments.length === 3) {
            payload = query;
            query = undefined;
        }
        
        if(query) {
            url += url.indexOf('?') === -1 ? '?' : '&';
            url += $.param(query);
        }
                
        var options = {
            dataType: 'json',
            contentType: "application/json",
            
            method: verb,
            url: url,
            data: JSON.stringify(payload),
        }
        
        return $.ajax(options);
    }
})( jQuery );