/**
 * Created by xm0025 on 16/10/27.
 */

var WOEID = '';
var type = 'f';
var cityList = [];
var kikaopen = window.kikaopen || {};

function initWeatherUi(data){
    console.log(data);
    if(data.query.results.channel && data.query.results.channel.item && data.query.results.channel.item.condition && data.query.results.channel.item.forecast && data.query.results.channel.location){
        $("#t").html(data.query.results.channel.item.condition.temp + '°');
        $("#top-text").html('<svg class="Va(m) Px(6px) Cur(p)" width="20" style="fill:rgba(255,255,255,.5);stroke:#fff;stroke-width:0;vertical-align:bottom;" height="20" viewBox="0 0 48 48" data-icon="arrow-up" data-reactid=".182var7nao6.$tgtm-Col1-0-Weather.1.0.1.1.1.0"><path d="M13.764 18.75c-.792.772-.808 2.037-.04 2.828.772.792 2.038.81 2.83.04l5.678-5.526v23.59h4v-23.59l5.68 5.525c.79.77 2.058.753 2.827-.04.377-.388.565-.89.565-1.394 0-.52-.202-1.042-.605-1.434L24.23 8.566 13.763 18.75z" data-reactid=".182var7nao6.$tgtm-Col1-0-Weather.1.0.1.1.1.0.0"></path></svg> '+data.query.results.channel.item.forecast[0].high + '°');
        $("#low-text").html('<svg class="Va(m) Px(6px) Cur(p)" width="20" style="fill:rgba(255,255,255,.5);stroke:#fff;stroke-width:0;vertical-align:bottom;" height="20" viewBox="0 0 48 48" data-icon="arrow-down" data-reactid=".182var7nao6.$tgtm-Col1-0-Weather.1.0.1.1.1.2"><path d="M34.7 29.5c.793-.773.81-2.038.04-2.83-.77-.79-2.037-.81-2.83-.038l-5.677 5.525V8.567h-4v23.59l-5.68-5.525c-.79-.77-2.058-.753-2.827.04-.378.388-.566.89-.566 1.394 0 .52.202 1.042.605 1.434l10.472 10.183L34.7 29.5z" data-reactid=".182var7nao6.$tgtm-Col1-0-Weather.1.0.1.1.1.2.0"></path></svg> '+data.query.results.channel.item.forecast[0].low + '°');
        $("#weather_text").html(data.query.results.channel.item.condition.text);
        $("#city").html(data.query.results.channel.location.city);
        $("#country").html(data.query.results.channel.location.country);
        $("#weather_image").attr('src','http://cdn.kikakeyboard.com/open_platform/images/weather/' + data.query.results.channel.item.condition.code + '.png');
        $("#all").show();
    }else{
        $("#all").show();
        alert('get data error');
    }
}

function bindEvent(){
    $("#c").bind('click',function(){
        checkType();
    });
    $("#shareBtn").bind('click',function(){
        kikaopen.media.shotScreen();
    });
}


function checkType(){
    if(type == 'f'){
        type = 'c';
        myFn.Command.GetYahooWeatherData({WOEID:WOEID,Type:type},function(data1){
            initWeatherUi(data1);
        });
    }else{
        type = 'f';
        myFn.Command.GetYahooWeatherData({WOEID:WOEID,Type:type},function(data1){
            initWeatherUi(data1);
        });
    }
    changeBtn();
}


function getDeviceAddressInfo() {
    kikaopen.requestAddress();
}
var info = kikaopen.getWindowInfo();
info = JSON.parse(info);
if(info.isFullScreen){
    $("#all").addClass('big-screen');
}
getDeviceAddressInfo();



function makeHttpRequest(url) {
    kikaopen.context.getGeographicCoordinate();
    kikaopen.requestHttpGet(url);
}
kikaopen.onLocation = function(data){
    if(data){
        var arr = data.split(',');
        kikaopen.context.requestAddress(arr[0], arr[1]);
    }else{
        toast('Get location failed');
    }
};
kikaopen.onLocationError = function(data) {
    toast(data);
}




//app js接口回调函数

kikaopen.onAddress = function (addressInfo) {
    var cityInfo = [];
    if(typeof  addressInfo == 'string'){
        cityInfo = JSON.parse(addressInfo);
    } else{
        cityInfo = addressInfo;
    }
    if(cityInfo){
        var url = "https://www.yahoo.com/news/_td/api/resource/WeatherSearch;text="+cityInfo.mLocality;
        makeHttpRequest(url);
    }
};
kikaopen.onAddressError = function(info){
    toast(info);
};

kikaopen.onHttpGet = function (data) {
    if(data){
        if(typeof data == 'string') {
            cityList = JSON.parse(data);
        }
        else {
            cityList = data;
        }
        WOEID = cityList[0].woeid;
        myFn.Command.GetYahooWeatherData({WOEID:WOEID,Type:type},function(data1){
            initWeatherUi(data1);
        });
    }
};
kikaopen.onHttpGetError = function (info){
    toast(info);
};

kikaopen.onWindowChanged = function (full,width,height){
    localStorage.full = full;
    if(full){
        //window.location.href = 'https://www.yahoo.com/news/weather/'+cityList[0].country+'/'+cityList[0].city+'/'+cityList[0].city+'-'+cityList[0].woeid;
        $("#all").addClass('big-screen');
    }else{
        $("#all").removeClass('big-screen');
    }
};

kikaopen.onShotScreen = function (path){
    kikaopen.shareContent("image", path);
};

function callback(data){
    console.log(data);
}

function toast(content) {
    kikaopen.toast(content);
}

function changeBtn(){
    if(type == 'f') {
        $("#f").html('F');
        $("#c").html('C');
    }else{
        $("#f").html('C');
        $("#c").html('F');
    }
}

bindEvent();
