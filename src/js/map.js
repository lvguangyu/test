
/**
 * Created by wenxiaojing on 16/12/1.
 */
var kikaopen=window.kikaopen || {};
function GoogleMap(map, infoWindow, service) {
    this.cityInfo = '{"mAddressLines":{"1":"AnDingMen, Dongcheng Qu, Beijing Shi","0":"47号-51 He Ping Li Xi Jie","2":"China"},"mAdminArea":"Beijing","mCountryCode":"CN","mCountryName":"China","mFeatureName":"47号-51号","mLocale":"en_US","mLocality":"Dongcheng","mSubThoroughfare":"47号-51号","mThoroughfare":"Hepingli West Street","mLatitude":39.9529947,"mLongitude":116.4188076,"mHasLatitude":true,"mHasLongitude":true,"mMaxAddressLineIndex":2}';
    this.pos = {lat: 39.9529947, lng:116.4188076};//默认定位,公司地址
    this.mk={lat: 39.9529947, lng:116.4188076};//当前显示的marker的定位
    this.map = map;
    this.infoWindow = infoWindow;
    this.service = service;
    this.debug = false;
    this.markers = [];
}

GoogleMap.prototype = {
    constructor: GoogleMap,
    //获取当前位置
    getCoordinate : function(){
        if(this.debug){
            kikaopen.onAddress(this.cityInfo);
        }else{
            kikaopen.requestAddress();
        }
    },
    setLocation: function () {
        var self=this;
        self.infoWindow.close();
        self.mk=self.pos;
        self.map.setCenter(self.pos);//设置地图中心点为当前位置
        self.markPosition(self.pos);//设置地图中心点标记
        self.service.nearbySearch({  //获得当前位置附近情况
            location: self.pos,
            radius: 500
        }, function (results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                self.placesList(results,0,self.pos);
            } else {
                return;
            }
        });
        var html="<span>Current Location</span>";
        self.setSelectPos(html);
        $("#arrowDiv").attr("lat",self.pos.lat);
        $("#arrowDiv").attr("lng",self.pos.lng);
        return self.pos;
    },
    //设置当前选中位置信息
    setSelectPos:function(html){
        $("#currentLocation").html("");
        $("#currentLocation").append(html);
    },
    //设置标记
    markPosition: function (pos) {
        //清除之前标记
        if (this.markers) {
            this.markers.forEach(function (marker) {
                marker.setMap(null);
            });
        }
        this.markers = [];
        //设置标记为当前位置
        var marker = new google.maps.Marker({
            position: pos
        });
        marker.setMap(this.map);
        this.map.setCenter(pos);
        this.markers.push(marker);
        this.mk=pos;
    },

    //地图文本搜索框
    setSearchBox: function () {
        var self = this;
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        self.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        self.map.addListener('bounds_changed', function () {
            searchBox.setBounds(self.map.getBounds());
        });
        searchBox.addListener('places_changed', function () {
            var places = searchBox.getPlaces();
            console.log("places:" + places);
            if (places.length == 0) {
                return;
            }
            // Clear out the old markers.
            if (self.markers) {
                self.markers.forEach(function (marker) {
                    marker.setMap(null);
                });
            }
            self.markers = [];
            var marker = new google.maps.Marker({
                map: self.map,
                position: self.pos,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale:7,
                    fillColor: '#4a90e2',
                    fillOpacity: 1,
                    strokeWeight: 3,
                    strokeColor:"#fff",
                    strokeOpacity:0.8
                }
            });
            marker.setMap(self.map);
            self.markers.push(marker);
            var bounds = new google.maps.LatLngBounds();
            //console.log("bounds:" + bounds);
            //console.log(places.length);
            places.forEach(function (place) {
                // Create a marker for each place.
                self.markers.push(new google.maps.Marker({
                    map: self.map,
                    title: place.name,
                    position: place.geometry.location
                }));
                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);

                }
            });
            self.map.setCenter(places[0].geometry.location);
            self.mk=places[0].geometry.location;
            var pos={lat: places[0].geometry.location.lat(), lng: places[0].geometry.location.lng()};
            if (places.length==1) {
                self.service.nearbySearch({
                    location:pos ,
                    radius: 500
                }, function (results, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        self.placesList(results,0,self.pos);
                    }
                })
            } else {
                self.placesList(places,1,self.pos);

            }
            var distance=self.formatDistance(self.pos,pos);
            var html="";
            html+='<p class="placeName"><span>'+places[0].name+'</span><span class="distance">'+distance+'</span></p>'
                +'<div class="placeDetailName">'+places[0].formatted_address+'</div>';
            self.setSelectPos(html);
        });
    },
    //位置列表
    placesList:function(list,flag,start){
        var self=this;
        var html="";
        list.forEach(function(place) {
            var target={
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            };
            var distance=self.formatDistance(start,target);
            if(flag){
                html += '<li lat="'+place.geometry.location.lat()+'" lng="'+place.geometry.location.lng()+'"><p class="placeName"><span>' + place.name + '</span><span class="distance">'+distance+'</span></p><p class="placeDetailName">' + place.formatted_address + '</p></li>'

            } else {
                html += '<li lat="'+place.geometry.location.lat()+'" lng="'+place.geometry.location.lng()+'"><p class="placeName"><span>' + place.name + '</span><span class="distance">'+distance+'</span></p><p class="placeDetailName">' + place.vicinity + '</p></li>';
            }
        });
        $("#nearbyList").html("");
        $("#nearbyList").scrollTop();
        $("#nearbyList").append(html);
    },
    formatDistance:function(start,target){
        var distance=utils.getPointToPointDistance(start,target);
        if(distance<1){
            distance=parseFloat(distance*1000).toFixed(2)+'m';
        } else {
            distance=parseFloat(distance).toFixed(2)+'km';
        }
        return distance;
    }
};
kikaopen.onAddress = function (addressInfo) {
    console.log(addressInfo);
    if(typeof  addressInfo == 'string'){
        cityInfo = JSON.parse(addressInfo);
    } else{
        cityInfo = addressInfo;
    }
    if(cityInfo){
        googleMap.pos= {lat: cityInfo.mLatitude, lng:cityInfo.mLongitude};
        googleMap.setLocation();
    }
};
kikaopen.onAddressError=function (info) {
    toast(info);
};
function toast(content) {
    kikaopen.toast(content);
}
var googleMap = "";
function initMap() {
    var options= {
        center: this.pos,
        scrollwheel: false,
        draggable: false,
        disableDefaultUI: true,
        maxZoom: 15,
        minZoom: 5,
        zoom: 15
    };
    var map = new google.maps.Map(document.getElementById('map'),options );
    var infoWindow = new google.maps.InfoWindow({map: map});
    var service = new google.maps.places.PlacesService(map);
    googleMap = new GoogleMap(map, infoWindow, service);
    googleMap.getCoordinate();
    googleMap.setSearchBox();

    //点击事件
    //当前位置
    $("#currentImg").click(function () {
        $("#pac-input").val("");
        googleMap.getCoordinate();
        googleMap.markPosition(googleMap.pos);
    });
    //附近列表
    $("#nearbyList").on('click','li',function(){
        var html=$(this).html();
        var lat=parseFloat($(this).attr("lat"));
        var lng=parseFloat($(this).attr("lng"));
        var pos={lat:lat, lng:lng};
        googleMap.mk=pos;
        console.log(pos);
        googleMap.markPosition(pos);
        $("#arrowDiv").attr("lat",lat);
        $("#arrowDiv").attr("lng",lng);

        var marker = new google.maps.Marker({
            position: googleMap.pos,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale:7,
                fillColor: '#4a90e2',
                fillOpacity: 1,
                strokeWeight: 3,
                strokeColor:"#fff",
                strokeOpacity:0.8
            }
        });
        marker.setMap(googleMap.map);
        googleMap.markers.push(marker);
        //var html=$(this).find('.placeName span:first-child').text();
        console.log(html);
        googleMap.setSelectPos(html);
    });
    //分享位置
    $("#currentDiv").on('click',function(){
        sharePosition();
    });
    $("#arrowDiv").on('click',function(){
        sharePosition();
    });
    //搜索框失焦
    $("#pac-input").click(function(event){
        event.stopPropagation();
        $("#map").click(function(){
            $("#pac-input").blur();
        })
    });
}
//分享位置
function sharePosition(){
    var lat=parseFloat($("#arrowDiv").attr("lat"));
    var lng=parseFloat($("#arrowDiv").attr("lng"));
    var url='https://www.google.com/maps?q=loc:'+lat+','+lng;
    console.log(url);
    kikaopen.shareContent("link",url);
}
kikaopen.onWindowChanged = function(full, width, height) {
    if(googleMap){
        setTimeout(function(){
            if(full){
                setHeight(true);
                $("#pac-input").removeClass('hide');
                $("#currentDiv").addClass('hide');
                $("#arrowDiv").removeClass('hide');
                $("#nearbyDiv").removeClass('hide');
                $("#locImg").removeClass('hide');
                google.maps.event.trigger(googleMap.map, "resize");
                googleMap.map.setCenter(googleMap.mk);
                googleMap.map.setOptions({draggable: true});

            }else{
                setHeight(false);
                $("#pac-input").addClass('hide');
                $("#currentDiv").removeClass('hide');
                $("#arrowDiv").addClass('hide');
                $("#nearbyDiv").addClass('hide');
                $("#locImg").addClass('hide');
                google.maps.event.trigger(googleMap.map, "resize");
                googleMap.map.setCenter(googleMap.mk);
                googleMap.map.setOptions({draggable: false});
            }
        },200)
    }
};


//判断出始页面是否为大屏
function setHeight(full) {
    var height = $(window).height();
    var width = $(window).width();
    if(full){
        var mapHeight = height/2+0.138 * width;
        $("#mapContent").css("height", mapHeight + "px");
        $("#map").css("height", height/2 + "px");
        $("#nearbyDiv").css("height",mapHeight  + "px");
        console.log(width);
    } else {
        var mapHeight = height - 0.138 * width;
        $("#mapContent").css("height", height + "px");
        $("#map").css("height", mapHeight + "px");
        $("#nearbyDiv").css("height", mapHeight + "px");
    }
}
//function isBigScreen(){
//    var info = kikaopen.getWindowInfo();
//    var isFullScreen=info.isFullScreen;
//    if(isFullScreen=="true"){
//        setHeight(true);
//    } else {
//        setHeight(false);
//    }
//}
//isBigScreen();
//设置map高度
setHeight(false);