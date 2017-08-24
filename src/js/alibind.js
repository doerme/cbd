import legoWaitng from './legolib/lego-waiting/0.0.1/legoWaiting.min.js';
import LegoToast from './legolib/lego-toast/0.0.1/legoToast.min.js';
import apppay from './lib/apppay.js';
import testmode from './lib/testmode.js';
import util from './lib/util.js';


var app = {
    smsTimer: null,
    szTimer: null,
    waiting: new legoWaitng("请稍后.", "extraClass"),
    curSelectArea: null,
    userinfo: null,
    gamemode: /testmode/.test(window.location.href) ? 'test' : 'normal',
    init: function(){
        var self = this;
        self.bindEven();
        self.qrcodeInit();
        $('.js-mob-show').html(util.getURLParam('mobnum'));
        $('.js-mobile').val(util.getURLParam('mobnum'));
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
            util.windowToast('请输入正确手机号');
            return;
        }
        if($('.js-checkcodeval').val().length < 4){
            util.windowToast('请输入图形验证码');
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
    bindAlipay: function(){
        if(!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test($('.js-mobile').val())){
            util.windowToast('请输入正确手机号');
            return;
        }
        util.ajaxPost('/app/mainext/bindAlipay', {
            mobile: $('.js-mobile').val(),
            alipay_account: $('.js-alipay_account').val(),
            sms_captcha: $('.js-alipay_sms').val()
        }).done((jdata)=>{
            if(jdata.code == 0){
                window.location.href = '/'
            }
        })
    },
    bindEven: function(){
        var self = this;
         /** 刷新验证码 */
         $('.js-checkcode').on('click', function(){
            self.qrcodeInit();
        });

        /** 获取短信验证码 */
        $('.js-get-check-code').on('click', function(){
            self.getSmsCode();
        })

        /** 建筑 */
        $('.js-alibind-bt').on('click', function(){
            self.bindAlipay();
        })
    }
}

window.onload = function(){
    app.init();
}