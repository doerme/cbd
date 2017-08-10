$('.js-loading-line').addClass('full');

var app = {
    init: function(){
        $('.js-loading-wrap').addClass('hide');
        $('.js-login-wrap').removeClass('hide');
    }
}

window.onload = function(){
    app.init()
}