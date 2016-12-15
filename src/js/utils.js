/**
 * Created by xm0025 on 16/11/3.
 */
function Utils(){

}
Utils.prototype = {
    constructor     : Utils,
    /**
     * 从url中获取参数
     * @param name  参数名称
     * @returns  参数value
     */
    getQueryString  : function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    },
    formatDateWithoutTime : function(date,interval){

        return date.getFullYear() + interval + (date.getMonth() + 1 > 10 ? date.getMonth() + 1 : '0' +(date.getMonth() + 1)) + interval + (date.getDate() > 10 ? date.getDate() : '0'+date.getDate());
    },
    cuterNum : function(str){
        return str.replace( /\B(?=(?:\d{3})+$)/g, ',' );
    },
    /**
     * 计算两点之间距离
     * @param start
     * @param end
     * @return 米
     */
    getPointToPointDistance : function(start,end){

        var lat1 = (Math.PI/180)*start.lat;
        var lat2 = (Math.PI/180)*end.lat;
        var lon1 = (Math.PI/180)*start.lng;
        var lon2 = (Math.PI/180)*end.lng;
        //地球半径
        var R = 6371;
        //两点间距离 km，如果想要米的话，结果*1000就可以了
        return (Math.acos(Math.sin(lat1)*Math.sin(lat2)+Math.cos(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1))*R).toFixed(1);
    },
    replaceTime : function(time){
        var str = time;
        str = str.replace('PT','');
        str = str.replace('H',':');
        str = str.replace('M',':');
        str = str.replace('S','');
        var strArray = str.split(":");
        var length = strArray.length;
        var timeArray = [];
        if(length == 3){
            timeArray.push(strArray[0].length > 1 ? strArray[0] : '0'+strArray[0]);
            timeArray.push(strArray[1].length > 1 ? strArray[1] : '0'+strArray[1]);
            timeArray.push(strArray[2].length > 1 ? strArray[2] : '0'+strArray[2]);
        }
        if(length == 2){
            timeArray.push('00');
            timeArray.push(strArray[0].length > 1 ? strArray[0] : '0'+strArray[0]);
            timeArray.push(strArray[1].length > 1 ? strArray[1] : '0'+strArray[1]);
        }
        if(length == 1){
            timeArray.push('00');
            timeArray.push('00');
            timeArray.push(strArray[0].length > 1 ? strArray[0] : '0'+strArray[0]);
        }
        return timeArray.join(':');
    },

};

var utils = new Utils();

/**
 * String       扩展方法
 * @param search       替换掉的字符
 * @param replacement  替换后的字符
 */
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};



