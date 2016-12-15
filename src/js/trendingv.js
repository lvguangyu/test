/**
 * Created by xm0025 on 16/11/28.
 */
var kikaopen = window.kikaopen || {};
function YouTube(){
    this.nextPageToken = '';
    this.key='AIzaSyBX1NCBWPX58HRmejWqiN3d1cYT6qa1Vs0';
}
YouTube.prototype = {
    constructor : YouTube,
    getData : function(drop,refresh){
        var self = this;
        var reqUrl = "https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet,contentDetails&maxResults=20&chart=mostPopular&regionCode=us&key="+self.key+(self.nextPageToken? '&pageToken='+self.nextPageToken : '');
        $.ajax({
            url: reqUrl,
            method: "GET",
            dataType:'json',
            success:function(data){
                self.setNextPageToken(data.nextPageToken);
                var html = self.listTemplate(data.items,drop);
                if(refresh){
                    $("#list").html('');
                }
                $("#list").append(html);
                $("img.lazy").lazyload({
                    //placeholder : "../images/game_loding.gif"
                });
                if(drop){
                    drop.resetload();
                    if(data.length = 0){
                        drop.noData();
                    }
                }
            }
        })
    },
    setNextPageToken : function(pageToken){
        this.nextPageToken = pageToken;
    },

    listTemplate : function(data,drop){
        var length = data.length;
        var con = [];
        for(var i = 0; i < length; i++){
            con.push('<div class="list-item" onclick="play(\''+data[i].snippet.title+'\',\''+data[i].id+'\',\''+data[i].snippet.thumbnails.medium.url+'\')">');
            con.push(' <div class="active-cover"></div>');
            con.push('<div class="img">');
            con.push('<img class="img lazy" data-original="'+data[i].snippet.thumbnails.medium.url+'" alt=""/>');
            con.push('<div class="time">');
            con.push(utils.replaceTime(data[i].contentDetails.duration));
            con.push('</div>');
            con.push('</div>');
            con.push('<div class="title end-line-point">');
            con.push(data[i].snippet.title);
            con.push('</div>');
            con.push('<div class="views-count">');
            con.push('<span>'+data[i].statistics.viewCount.replace( /\B(?=(?:\d{3})+$)/g, ',' )+'</span> views<span>YouTube</span>');
            con.push('</div>');
            con.push('</div>');
        }
        return con.join('');
    }

};
var youTube = new YouTube();

function bindDrop(){
    $('.content').dropload({
        scrollArea  : window,
        domUp       : {
            domClass    : 'dropload-up',
            domRefresh  : '<div class="dropload-refresh">↓Pull down to refresh.</div>',
            domUpdate   : '<div class="dropload-update">↑Release the refresh.</div>',
            domLoad     : '<div class="dropload-load"><span class="loading"></span>Loading...</div>'
        },
        domDown     : {
            domClass    : 'dropload-down',
            domRefresh  : '<div class="dropload-refresh">↑Pull up to load more.</div>',
            domLoad     : '<div class="dropload-load"><span class="loading"></span>Loading...</div>',
            domNoData   : '<div class="dropload-noData">No data.</div>'
        },
        autoLoad    : true,
        loadDownFn  : function(me){
            youTube.getData(me,false);
        },
        loadUpFn    : function(me){
            youTube.setNextPageToken('');
            youTube.getData(me,true);
        }
    });
}
kikaopen.onWindowChanged = function (full,width,height){
    localStorage.full = full;
}
function play(title,id,url){
    window.location.href='./trendingVPlay?title='+title+'&id='+id+'&imgUrl='+encodeURIComponent(url);
}
bindDrop();