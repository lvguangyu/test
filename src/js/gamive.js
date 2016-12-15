/**
 * Created by wenxiaojing on 16/11/29.
 */
function TwitchList(twitchTemplate){
    this.clientId = '5blihtpbpnsddrx4u2jbu7ndlzvfyzk';
    this.twitchTemplate = twitchTemplate;
    this.nextUrl        = '';
    this.url='';
}
TwitchList.prototype={
    constructor:TwitchList,
    init:function(){
        this.getChannelUrl();
        this.getGameList(this.url);
    },
    getChannelUrl:function(){
        this.url='https://api.twitch.tv/kraken/streams?client_id='+this.clientId+'&limit=30';
    },
    addClientId     : function(url){
        return url+'&client_id='+this.clientId;
    },
    getGameList:function(url,dropLode,refresh){
        var self=this;
        $.ajax({
            method:"POST",
            url:url,
            dataType:'jsonp',
            jsonp:'callback',
            success:function(data){
                console.log(data.streams.length);
                self.nextUrl = self.addClientId(data._links.next);
                var html = self.twitchTemplate.getGameTemplate(data.streams);
                if(refresh){
                    $("#twitchList").html('');
                }
                $("#twitchList").append(html);
                $("img.lazy").lazyload({
                    placeholder : "http://cdn.kikakeyboard.com/open_platform/images/game_loding.png"
                });
                if(dropLode){
                    dropLode.resetload();
                    if(data.streams.length = 0){
                        dropLode.noData();
                    }
                }

            }

        })
    }

};
var twitchList = new TwitchList(twitchTemplate);
twitchList.init();

    bindDrop();


function bindDrop(){
    $('#twitchContent').dropload({
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
            var url ='';
            if(!twitchList.nextUrl){
                twitchList.getChannelUrl();
                url = twitchList.url;

            }else{
                url = twitchList.nextUrl;
            }
            twitchList.getGameList(url,me);

        },
        loadUpFn    : function(me){
            twitchList.getGameList(twitchList.url,me,true);

        }
    });
}

