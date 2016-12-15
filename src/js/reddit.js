/**
 * Created by xm0025 on 16/12/13.
 */
var kikaopen = window.kikaopen || {};
var vid = '';
function Reddit(){
    this.redditDataUrl = 'https://www.reddit.com/r/funny.json';
    this.after = '';
    this.first = true;
}
Reddit.prototype = {
    constructor : Reddit,
    setAfter : function(a){
        this.after = a;
    },
    getData : function(drop,refresh){
        var self = this;
        $.ajax({
            url: self.redditDataUrl+(self.after == '' ? '':'?after='+self.after),
            method: "GET",
            dataType:'json',
            success:function(data){
                console.log(data);
                self.setAfter(data.data.after);
                var html = self.listTemplate(data.data.children);
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
    listTemplate : function(data){
        var con = [];
        var length = data.length;
        for(var i=0;i<length;i++){
            if(this.first){
                this.first = false;
                continue;
            }

            if( data[i].data.preview){
                var url = this.checkShareUrl(data[i]);
                var btnHtml = this.initBtn(data[i]);
                var type = this.checkResourceType(data[i]);
                var imageOrVideo = this.initImage(data[i]);

                con.push('<div class="list-item">');
                con.push('<div class="list-item-title">');
                con.push(data[i].data.title);
                con.push('</div>');
                con.push('<div>');
                con.push(imageOrVideo);
                con.push(btnHtml);
                con.push('</div>');
                con.push('<button class="send-btn btn" onclick="share(\''+type+'\',\''+url +'\')"><img src="http://cdn.kikakeyboard.com/open_platform/images/send.png" alt=""/></button>');
                con.push('</div>');
            }
        }
        return con.join('');
    },
    checkResourceType : function(data){
        var type = 'image';
        if(data.data.preview.images[0].variants.mp4){
            type = 'video';
        }
        return type;
    },
    initBtn : function(data){
        var imageObj = data.data.preview.images[0].source;
        var con = [];
        if(data.data.preview.images[0].variants.mp4){
            con = [];
            con.push('<div style="position:absolute;margin-top:-'+data.data.preview.images[0].source.height/data.data.preview.images[0].source.width * 95.56+'vw;width:95.56vw;height:'+data.data.preview.images[0].source.height/data.data.preview.images[0].source.width * 95.56+'vw">');
            con.push('<img class="gif-btn"  onclick="playVideo(this,\''+data.data.id+'\',\''+data.data.preview.images[0].source.url+'\',\''+data.data.preview.images[0].variants.mp4.source.url+'\','+data.data.preview.images[0].source.height/data.data.preview.images[0].source.width * 95.56+')" style="margin-top:'+((imageObj.height/imageObj.width * 95.56-30)/2).toFixed(2) +'vw  " src="http://cdn.kikakeyboard.com/open_platform/images/play.png"/>');
            con.push('<img class="gif-btn loading" style="margin-top:'+((imageObj.height/imageObj.width * 95.56-30)/2).toFixed(2) +'vw  " src="http://cdn.kikakeyboard.com/open_platform/images/loading.png"/>');
            con.push('</div>');
        }
        return con.join('');
    },
    checkShareUrl : function(data){
        var url = data.data.preview.images[0].source.url;
        if(data.data.preview.images[0].variants.mp4){
            url = 'https://www.reddit.com' + data.data.permalink;
        }
        return url;
    },
    initImage : function(data){
        var con = [];
        con.push('<div id="'+data.data.id+'" style="width:95.56vw;height:'+data.data.preview.images[0].source.height/data.data.preview.images[0].source.width * 95.56+'vw" >');
        con.push(' <img class="img lazy" data-original="'+data.data.preview.images[0].source.url+'" style="width:95.56vw;height:'+data.data.preview.images[0].source.height/data.data.preview.images[0].source.width * 95.56+'vw" alt=""/>');
        con.push('</div>');
        return con.join('');
    },
    initVideo : function(id,imgUrl,resourceUrl,height){
        var con = [];
        con.push('<video id="video_'+id+'" poster="'+imgUrl+'" loop="" style="margin:0;width:95.56vw;height:'+height+'vw" autoplay="" loop="">');
        con.push('<source type="video/mp4" src="'+resourceUrl+'">');
        con.push('</video>');
        return con.join('');
    }

};

var reddit = new Reddit();

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
            reddit.getData(me,false);
        },
        loadUpFn    : function(me){
            reddit.setAfter('');
            reddit.first = true;
            reddit.getData(me,true);
        }
    });
}
kikaopen.onWindowChanged = function (full,width,height){
    localStorage.full = full;
};
function share(type,imgUrl){
    if(type == 'image')
        kikaopen.shareContent('image',imgUrl);
    else
        kikaopen.shareContent('text',imgUrl);

}
function playVideo(obj,id,imgUrl,resourceUrl,height){
    showLoading(obj);
    var html = reddit.initVideo(id,imgUrl,resourceUrl,height);
    $("#" + id).html(html);
    if(vid){
        showPlayBtn();
    }
    vid = document.getElementById('video_'+id);
    setTimeout(function(){
        vid.play();
    },1000);

    vid.onplay = function() {
        hiddenLoading(obj);
    };
}

function hiddenLoading(obj){
    $(obj).parent().find('img[class="gif-btn loading"]').hide();
}
function showLoading(obj){
    $(obj).hide();
    $(obj).parent().find('img[class="gif-btn loading"]').show();
}
function showPlayBtn(){
    vid.pause();
    $(vid).parent().parent().find('img[class="gif-btn"]').show();
    vid = null;
}
bindDrop();
window.onscroll = function(){

    var isInView = isElementInViewport(vid);
    if(isInView === false){
        showPlayBtn();
    }
}

function isElementInViewport (el) {
    if(el){
        var rect = el.getBoundingClientRect();
        return (
            rect.top >= -300 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)+300 && /*or $(window).height() */
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
        );
    }
}

