/**
 * Created by xm0025 on 16/11/10.
 */

localStorage.full = false;
function Wiki(){

}

Wiki.prototype = {
    constructor : Wiki,
    bindEvent : function(){
        $("#search_btn").bind('click',function(){
            kikaopen.stretchWindow(true);
            window.location.href= 'https://en.m.wikipedia.org/wiki/Main_Page';
        });
    },
    getWikiTrends : function(){
        var date = utils.formatDateWithoutTime(new Date(new Date().getTime() -86400000), '/');
        var reqUrl = "https://en.wikipedia.org/api/rest_v1/feed/featured/"+date;
        //kikaopen.requestHttpGet(reqUrl,'initTrends');
        $.ajax({
            method: "GET",
            url: reqUrl,
            dataType:'json',
            success:function(data){
                initTrends(data);
                initBigScreenList(data);
            }
        })
    }

};

function initTrends(dataList){
    var con = [];
    if(dataList.mostread && dataList.mostread.articles){
        var length = dataList.mostread.articles.length > 5 ? 5 : dataList.mostread.articles.length;
        for(var i =0 ;i< length; i++){
            con.push('<div class="a-div">');
            con.push('<div class="a" onclick="goToWiki(\''+dataList.mostread.articles[i].normalizedtitle+'\')">'+dataList.mostread.articles[i].normalizedtitle+'</div>');
            con.push('</div>');
        }
        $("#list").html(con.join(''));
    }
};

function initBigScreenList(dataList){
    var con = [];
    if(dataList.mostread && dataList.mostread.articles){
        var length = dataList.mostread.articles.length > 10 ? 10 : dataList.mostread.articles.length;
        for(var i =5 ;i< length; i++){
            con.push('<div class="a-div">');
            con.push('<div class="a" onclick="goToWiki(\''+dataList.mostread.articles[i].normalizedtitle+'\')">'+dataList.mostread.articles[i].normalizedtitle+'</div>');
            con.push('</div>');
        }
        $("#list1").html(con.join(''));
    }
};

kikaopen.initTrendsError = function (data){
    kikaopen.shareContent("text", data);
};

kikaopen.onWindowChanged = function (full,width,height){
    localStorage.full = full;
    if(full){
        showList1();
    }else{
        hiddenList1();
    }
};
function goToWiki(title){
    var url = 'https://en.m.wikipedia.org/wiki/'+title;
    localStorage.full = true;
    kikaopen.stretchWindow(true);
    window.location.href = url;
}

function showList1(){
    $("#list1").show();
}
function hiddenList1(){
    $("#list1").hide();
}

function checkoutBigScreen(){
    showList1();
}
//checkoutBigScreen();
var info = kikaopen.getWindowInfo();
info = JSON.parse(info);
if(info.isFullScreen){
    checkoutBigScreen();
}
var wiki = new Wiki();
wiki.bindEvent();
wiki.getWikiTrends();
