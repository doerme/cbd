$('.js-loading-line').addClass('full');
var apiHost = '//cbd.tcpan.com';
var app = {
    init: function(){
        var self = this;
        $('.js-loading-wrap').addClass('hide');
        $('.js-login-wrap').removeClass('hide');
        self.bindEven();
    },
    gameviewInit: function(){
        $('.js-login-wrap,.js-reg-wrap').addClass('hide');
        $('.js-main-view').removeClass('hide');
    },
    /** 获取图形验证码 */
    qrcodeInit: function(){
        $.ajax({
            dataType: 'JSONP',
            url: apiHost+'/app/main/getPicCaptcha'
        }).done(function(jdata){            
            if(jdata.code == 0){
                $('.js-checkcode').attr({
                    src: jdata.data.pic_captcha,
                    session_id: jdata.data.session_id,
                })
            }
        })
    },
    /** 获取短信验证码 */
    getSmsCode: function(){
        $.ajax({
            url: apiHost+'/app/main/getSmsCaptcha',
            dataType: 'jsonp',
            data: {
                mobile: $('.js-mobile').val(),
                session_id: $('.js-checkcode').attr('session_id'),
                pic_captcha: $('.js-checkcodeval').val(),
            }
        })
    },
    bindEven: function(){
        var self = this;
        /** 登录注册成功 */
        $('.js-login-bt').on('click', function(){
            self.gameviewInit();
        });
        /** 完成注册 */
        $('.js-regdone-bt').on('click',function(){
            self.gameviewInit();
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