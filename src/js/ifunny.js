/**
 * Created by xm0025 on 16/10/27.
 */
function Ifunny(){
    this.urlArray = {
        'featured' : 'https://ifunny.co/',
        'about'    : 'https://ifunny.co/app/about',
        'store'    : 'http://ifunnyoriginal.spreadshirt.com/',
        'app'      : 'https://play.google.com/store/apps/details?id=mobi.ifunny'
    };
    this.btnFlag = '';
    this.fullScreen = false;
}
Ifunny.prototype.bindEvent = function(){

    var self = this;

    $('#featured').bind('click',function(){
        self.btnFlag = 'featured';
        self.setBigScreen();
    });

    $('#about').bind('click',function(){
        self.btnFlag = 'about';
        self.setBigScreen();
    });

    $('#store').bind('click',function(){
        self.btnFlag = 'store';
        self.setBigScreen();
    });

    $('#app').bind('click',function(){
        self.btnFlag = 'app';
        self.setBigScreen();
    });


};

Ifunny.prototype.setBigScreen = function(){
    var self = this;
    if(!self.fullScreen){
        kikaopen.stretchWindow(true);
    //}else{
        window.location.href = self.urlArray[self.btnFlag];
    }
};

kikaopen.onWindowChanged = function (full,width,height){
    localStorage.full = full;
};


var ifunny = new Ifunny();
ifunny.bindEvent();