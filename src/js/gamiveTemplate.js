/**
 * Created by wenxiaojing on 16/11/29.
 */
var TwitchTemplate  = function(){
    this.itemArray = [];
};

TwitchTemplate.prototype.getGameTemplate = function(obj){
    this.itemArray = obj;
    var con = [];
    for(var i = 0;i<this.itemArray.length;i++){
        con.push('<div class="listItem" onclick="window.location.href=\''+this.itemArray[i].channel.url.replace('www','m')+'\'">');
        con.push('<img class="lazy" data-original="'+this.itemArray[i].preview.large+'" alt=""/>');
        con.push('<div class="text">');
        con.push('<div class="game-name">Playing&nbsp;'+this.itemArray[i].channel.game+'</div>');
        con.push('<div class="name">'+this.itemArray[i].channel.name+'</div>');
        con.push('<div class="game-views">'+this.itemArray[i].channel.views+' viewers</div>');
        con.push('</div>');
        con.push('</div>');
    }
    return con.join('');
};
function goToTwitchPage(url){
    kikaopen.stretchWindow(true);
    window.location.href=url;

}
var twitchTemplate = new TwitchTemplate();