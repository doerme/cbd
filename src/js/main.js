$('.js-loading-line').addClass('full');

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
    bindEven: function(){
        var self = this;
        /** 登录注册成功 */
        $('.js-login-bt').on('click', function(){
            self.gameviewInit();
        });
        $('.js-regdone-bt').on('click',function(){
            self.gameviewInit();
        })

        $('.js-reg-bt').on('click', function(){
            $('.js-login-wrap').addClass('hide');
            $('.js-reg-wrap').removeClass('hide');
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