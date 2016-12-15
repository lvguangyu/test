/**
 * Created by xm0025 on 16/11/29.
 */

var kikaopen = window.kikaopen || {};
function YouTubePlay(){
    this.key='AIzaSyBX1NCBWPX58HRmejWqiN3d1cYT6qa1Vs0';
}
YouTubePlay.prototype = {
    getVideoInfo : function(){
        var self = this;
        var reqUrl = "https://www.googleapis.com/youtube/v3/videos?part=id,snippet,statistics&id="+videoId+"&key="+self.key;
        $.ajax({
            url: reqUrl,
            method: "GET",
            dataType:'json',
            success:function(data){
                self.initInfo(data.items[0]);
                self.getTj();
            }
        })
    },
    initInfo : function(data){
        cagetoryId = data.snippet.categoryId;
        $("#info_title").html(data.snippet.localized.title);
        $("#channel_title").html(data.snippet.channelTitle);
        $("#views").html(utils.cuterNum(data.statistics.viewCount)+" views");
        $("#like_count").html(utils.cuterNum(data.statistics.likeCount));
        $("#dis_like_count").html(utils.cuterNum(data.statistics.dislikeCount));
    },
    getTj : function(){
        var self = this;
        var reqUrl = "https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet,contentDetails&maxResults=10&chart=mostPopular&regionCode=us&videoCategoryId="+cagetoryId+"&key="+self.key;
        $.ajax({
            url: reqUrl,
            method: "GET",
            dataType:'json',
            success:function(data){
                var html = self.listTemplate(data.items);
                $("#list").html(html);
                $("img.lazy").lazyload();
            }
        })
    },
    listTemplate : function(data){
        var length = data.length;
        var con = [];
        for(var i = 0; i < length; i++){
            con.push('<div class="list-item" onclick="play(\''+data[i].id+'\')">');
            con.push(' <div class="active-cover"></div>');
            con.push('<div class="img">');
            con.push('<img class="img lazy" data-original="'+data[i].snippet.thumbnails.medium.url+'" alt=""/>');
            con.push('<div class="time">');
            con.push(utils.replaceTime(data[i].contentDetails.duration));
            con.push('</div>');
            con.push('</div>');
            con.push('<div class="list-title end-line-point">');
            con.push(data[i].snippet.title);
            con.push('</div>');
            con.push('<div class="views-count">');
            con.push('<span>'+utils.cuterNum(data[i].statistics.viewCount)+'</span> views<span>YouTube</span>');
            con.push('</div>');
            con.push('</div>');
        }
        return con.join('');
    }
};

var tag = document.createElement('script');
var cagetoryId = '';
tag.src = "http://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var videoId = '<%= id %>';
var imageUrl = '<%= imgUrl %>';
$("#preview").attr('src',imageUrl);
var youtubePlay = new YouTubePlay();

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: videoId,
        //autoplay : 1,
        poster:imageUrl,
        playerVars: { 'autoplay': 1},
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });

}

function onPlayerReady(event) {
    //event.target.playVideo();
    youtubePlay.getVideoInfo();
}

var done = false;
function onPlayerStateChange(event) {
    youtubePlay.getVideoInfo();
}
function stopVideo() {
    player.stopVideo();
}
function play(id){
    videoId = id;
    player.loadVideoById(id);
    $(document).scrollTop(0);
    youtubePlay.getVideoInfo();
}
kikaopen.onWindowChanged = function(full,width,height){
    localStorage.full = full;
}