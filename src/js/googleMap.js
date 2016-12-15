/**
 * Created by xm0025 on 16/11/7.
 */
function GoogleMap (){
    this.cityInfo = '{"mAddressLines":{"1":"AnDingMen, Dongcheng Qu, Beijing Shi","0":"47号-51 He Ping Li Xi Jie","2":"China"},"mAdminArea":"Beijing","mCountryCode":"CN","mCountryName":"China","mFeatureName":"47号-51号","mLocale":"en_US","mLocality":"Dongcheng","mSubThoroughfare":"47号-51号","mThoroughfare":"Hepingli West Street","mLatitude":39.9529947,"mLongitude":116.4188076,"mHasLatitude":true,"mHasLongitude":true,"mMaxAddressLineIndex":2}';
    this.debug = false;
    this.bigScreenFlag = false;
}
GoogleMap.prototype = {
    constructor   : GoogleMap,
    getCoordinate : function(){
        if(this.debug){
            kikaopen.onAddress(this.cityInfo);
        }else{
            kikaopen.requestAddress();
        }
    },
    bindEvent : function(){
        var self = this;
        $("#bigBtn").bind('click',function(){
            kikaopen.stretchWindow(true);
        });
        $("#shareBtn").bind('click',function(){
            kikaopen.shareContent("text",'https://www.google.com/maps/@'+cityInfo.mLatitude+','+cityInfo.mLongitude+',17z');
        });
    }
};
var cityInfo = '';
var googleMap = new GoogleMap();
googleMap.bindEvent();

//app js接口回调函数

kikaopen.onAddress = function (addressInfo) {
    if(typeof  addressInfo == 'string'){
        cityInfo = JSON.parse(addressInfo);
    } else{
        cityInfo = addressInfo;
    }
    if(cityInfo){
        var myLatLng = {lat: cityInfo.mLatitude, lng:cityInfo.mLongitude};
        var map = new google.maps.Map(document.getElementById('map'), {
            center: myLatLng,
            scrollwheel: false,
            disableDefaultUI: true,
            maxZoom :15,
            minZoom :15,
            zoom: 15
        });
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: ''
        });
    }
}

kikaopen.onWindowChanged = function (full,width,height){
    localStorage.full = full;
    if(googleMap){
        window.location.href= 'https://www.google.com/maps/@'+cityInfo.mLatitude+','+cityInfo.mLongitude+',17z';
    }
};
kikaopen.onAddressError = function (info) {
    toast(info);
};
function toast(content) {
    kikaopen.toast(content);
}
function initMap() {
    googleMap.getCoordinate();
    // Create a map object and specify the DOM element for display.

}


