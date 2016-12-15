var myFn=(function($){
    var myObject={};
    var _Command=function(options){
        var params={
            url:'',
            callback:function(){}
        }
        $.extend(params, options || {});
        $.getJSON(params.url,function(data){
            params.callback(data);
        })
    }
    var _GetCity=function(callback){
        geoip2.city(function(data){
            callback(data);
        })

    }
    myObject.Command={
        GetCityDataFormIP:function(callback){
            return _GetCity(callback);
        },
        GetCityData:function(options,callback){
            if($.isFunction(options)){
                callback=options;
                options={};
            }
            options = $.extend({city:''},options, {});
            var url='http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.places%20where%20text%3D%22'+options.city+'%22&format=json&diagnostics=true&callback=?';
            return _Command({
                url:url,
                callback:callback
            })
        },
        GetYahooWeatherData:function(options,callback){
            if($.isFunction(options)){
                callback=options;
                options={};
            }
            options = $.extend({WOEID:'',Type:'c'},options, {});
            var url='http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid='+options.WOEID+'%20and%20u="'+options.Type+'"&format=json&diagnostics=true&callback=?';
            return _Command({
                url:url,
                callback:callback
            })
        }

    }
    return myObject;
}(jQuery));