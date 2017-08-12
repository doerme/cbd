import legoWaitng from './legolib/lego-waiting/0.0.1/legoWaiting.min.js';
import LegoToast from './legolib/lego-toast/0.0.1/legoToast.min.js';
import util from './lib/util.js';
$('.js-loading-line').addClass('full');
var apiHost = '//cbd.tcpan.com';
var app = {
    smsTimer: null,
    waiting: new legoWaitng("请稍后.", "extraClass"),
    legoToast: new LegoToast({
        msg        : "操作成功",
        time       : 1200,
        extraclass : "extraclass"
    }),
    windowToast: function(msg, mtime){
        this.legoToast.changeText(msg || 'toast'); // 修改文案
        this.legoToast.changeTime(mtime || 1200); // 修改消失时间
        this.legoToast.open(); // 再次打开
    },
    init: function(){
        var self = this;
        $('.js-loading-wrap').addClass('hide');
        $('.js-login-wrap').removeClass('hide');
        self.bindEven();
    },
    gameviewInit: function(){
        util.ajaxFun('/app/main/getUserInfo',{}).done((jdata)=>{
            if(jdata.code == 0){
                $('.js-login-wrap,.js-reg-wrap').addClass('hide');
                $('.js-main-view').removeClass('hide');
            }else{
                $('.js-login-wrap').removeClass('hide');
                $('.js-main-view').addClass('hide');
            }
            
        })
        
    },
    /** 完成注册 */
    regdone: function(){
        var self = this;
        if(!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test($('.js-mobile').val())){
            self.windowToast('请输入正确手机号');
            return;
        }
        if($('.js-sms-code').val().length < 4){
            self.windowToast('请输入短信验证码');
            return;
        }
        if($('.js-reg-pwd').val().length < 4){
            self.windowToast('请输入密码');
            return;
        }
        util.ajaxPost('/app/main/register',{
            sms_captcha: $('.js-sms-code').val(),
            mobile: $('.js-mobile').val(),
            password: $('.js-reg-pwd').val()
        }).done((jdata)=>{
            if(jdata.code == 0){
                self.windowToast('完成注册');
                gameviewInit();
            }
        })

    },
    /** 完成登录 */
    logindone: function(){
        var self = this;
        if(!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test($('.js-login-mob').val())){
            self.windowToast('请输入正确手机号');
            return;
        }
        if($('.js-login-pwd').val().length < 4){
            self.windowToast('请输入密码');
            return;
        }
        util.ajaxPost('/app/main/login',{
            mobile: $('.js-login-mob').val(),
            password: $('.js-login-pwd').val()
        }).done((jdata)=>{
            if(jdata.code == 0){
                self.gameviewInit();
            }
        })
    },
    /** 获取图形验证码 */
    qrcodeInit: function(){
        util.ajaxFun('/app/main/getPicCaptcha',{}).done(function(jdata){            
            if(jdata.code == 0){
                $('.js-checkcode').attr({
                    src: jdata.data.pic_captcha,
                    session_id: jdata.data.session_id,
                })
            }
        })
    },
    /** 短信验证码倒计时 */
    smsCodeTimeout: function(){
        var self = this;
        var timeoutVal = window.localStorage.getItem('smstimeout');
        console.log('smsCodeTimeout', new Date()*1 - timeoutVal);
        if(timeoutVal && new Date()*1 - timeoutVal < 60*1000 ){
            $('.js-get-check-code').addClass('disable').html(' 60秒');
            self.smsTimer = setInterval(function(){
                var thedate = new Date()*1;
                var timeoutshow = Math.ceil(60 - (thedate - timeoutVal)/1000);
                $('.js-get-check-code').addClass('disable').html(` ${timeoutshow}秒`);
                if(timeoutshow <= 0){
                    clearInterval(self.smsTimer);
                    $('.js-get-check-code').removeClass('disable').html(' 获取短信验证码');
                    window.localStorage.setItem('smstimeout', null);
                }
            },1000);
        }else{
            $('.js-get-check-code').removeClass('disable').html(' 获取短信验证码');
            window.localStorage.setItem('smstimeout', null);
        }
    },
    /** 获取短信验证码 */
    getSmsCode: function(){
        var self = this;
        if(!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test($('.js-mobile').val())){
            self.windowToast('请输入正确手机号');
            return;
        }
        if($('.js-checkcodeval').val().length < 4){
            self.windowToast('请输入图形验证码');
            return;
        }
        window.localStorage.setItem('smstimeout', new Date() * 1);
        self.smsCodeTimeout();
        util.ajaxPost('/app/main/getSmsCaptcha',{
            mobile: $('.js-mobile').val(),
            session_id: $('.js-checkcode').attr('session_id'),
            pic_captcha: $('.js-checkcodeval').val()
        }).done((jdata)=>{
            console.log('getSmsCode',jdata);
        })

    },
    bindEven: function(){
        var self = this;
        /**选地建筑逻辑 */
        $('.js-area-wrap').on('click', '.area-unit', function(){
            $('.select-build-wrap').removeClass('hide');
        });
        $('.js-sb-list > li').on('click', function(){
            $('.js-sb-list > .cur').removeClass('cur');
            $(this).addClass('cur');
        });
        /**选地取消 */
        $('.js-sb-cancel').on('click', function(){
            $('.select-build-wrap').addClass('hide');
        });
        /**选地确认 */
        $('.js-sb-sure').on('click', function(){
            $('.select-build-wrap').addClass('hide');
        });
        /** 登录 */
        $('.js-login-bt').on('click', function(){
            self.logindone();
        });
        /** 完成注册 */
        $('.js-regdone-bt').on('click',function(){
            self.regdone();
        })
        /** 注册页面 */
        $('.js-reg-bt').on('click', function(){
            $('.js-login-wrap').addClass('hide');
            $('.js-reg-wrap').removeClass('hide');
            self.qrcodeInit();
        });
        /** 刷新验证码 */
        $('.js-checkcode').on('click', function(){
            self.qrcodeInit();
        });

        /** 获取短信验证码 */
        $('.js-get-check-code').on('click', function(){
            self.getSmsCode();
        })

        /** 二维码界面 */
        $('.js-go-qr-view').on('click', function(){
            $('.js-qr-view').removeClass('hide');
        })
        
        $('.js-gologin-bt').on('click', function(){
            $('.js-login-wrap').removeClass('hide');
            $('.js-reg-wrap').addClass('hide');
        })
    }
}

window.onload = function(){
    app.init()
}