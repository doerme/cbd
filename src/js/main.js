$('.js-loading-line').addClass('full');

var app = {
    init: function(){
        var self = this;
        $('.js-loading-wrap').addClass('hide');
        $('.js-login-wrap').removeClass('hide');
        self.bindEven();
    },
    bindEven: function(){
        $('.js-reg-bt').on('click', function(){
            $('.js-login-wrap').addClass('hide');
            $('.js-reg-wrap').removeClass('hide');
        })
    }
}

window.onload = function(){
    app.init()
}