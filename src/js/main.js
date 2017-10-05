import legoWaitng from './legolib/lego-waiting/0.0.1/legoWaiting.min.js';
import LegoToast from './legolib/lego-toast/0.0.1/legoToast.min.js';
import apppay from './lib/apppay.js';
import testmode from './lib/testmode.js';
import util from './lib/util.js';
setTimeout(function() {
    $('.js-loading-line').addClass('full');
}, 100);

var pageTpl = {
    maparea: require('./tpl/maparea.tpl'),
    fanlist: require('./tpl/fanlist.tpl'),
    salelist: require('./tpl/salelist.tpl')
};

var app = {
    smsTimer: null,
    szTimer: null,
    waiting: new legoWaitng("请稍后.", "extraClass"),
    curSelectArea: null,
    userinfo: null,
    gamemode: /testmode/.test(window.location.href) ? 'test' : 'normal',
    init: function(){
        var self = this;
        $('.js-loading-wrap').addClass('hide');
        if(self.gamemode == 'test') {
            testmode.gameviewInit();
        }else{
            $.get('/app/api/is_login_tow/',{}).done((jdata)=>{
                if(jdata.data.login==1){
                    self.gameviewInit();
                }else{
                    $('.js-login-wrap').removeClass('hide');
                }
            })
            self.bindEven();
        }
        util.wechatShareInit({
            title: '跟我一起做地产大亨',
            desc: 'CBD盛大开盘，别再错过这个机遇，下一个地产大亨就是你。',
            link: window.location.href, /*默认值是当前页面连接*/
            img:'http://cbd.tcpan.com/mex/cbd/img/page/icon.png',
            request_share_url: '/common/jsapi?url=' + encodeURIComponent(window.location.href.split('#')[0]), /*默认值是h5.yy.com*/
            success_callback:function(){},	/*分享成功回调*/
            cancel_callback:function(){},	/*分享失败回调*/
            debug:false	/*是否启用调试*/
        })
        util.setCookie('is_app', util.is_weixn()?'0':'1');
    },
    gameviewInit: function(){
        var self = this;
        /**获取用户信息 */
        util.ajaxFun('/app/main/getUserInfo',{
        }).done((jdata)=>{
            if(jdata.code == 0){
                self.userinfo = jdata.data;
                $('.js-login-wrap,.js-reg-wrap').addClass('hide');
                $('.js-main-view').removeClass('hide');
                $('.js-jb-show').html(jdata.data.jb);
                $('.js-user-name').html(jdata.data.nickname || '还没名字');
                $('.js-activation_code_num').html(jdata.data.activation_code_num);
                jdata.data.headimgurl && $('.js-user-avatar').attr('src',jdata.data.headimgurl);
                if(jdata.data.is_activated == 1){
                    $('.js-my-jhm').find('.ccc-out').html('已激活').addClass('gray');
                }
                self.getUserLands();
            }else{
                $('.js-login-wrap').removeClass('hide');
                $('.js-main-view').addClass('hide');
            }
        });
        /**获取钻石数 */
        util.ajaxFun('/app/sb/getUserZs',{}).done((jdata)=>{
            if(jdata.code == 0){
                $('.js-user-zs').html(jdata.data.zs);
            }
        });
        self.getShowzuTime();
    },
    /** 获取收租时间 */
    getShowzuTime: function(){
        var self = this;
        $.get({
            url: '/app/api/sz_time',
            dataType: 'JSONP',
        }).done((jdata)=>{
            if(jdata.data.type == 1){
                /** 没有收租建筑 */
                $('.js-user-shouzu-bt').attr({
                    src: '/mex/cbd/img/shouzu/shouzu_1.png'
                });
                $('.user-shouzu-timeout').addClass('hide');
            }else if(jdata.data.type == 2){
                var lasttimeup = jdata.data.sz_time;
                /** 倒计时 */
                $('.js-user-shouzu-bt').attr({
                    src: '/mex/cbd/img/shouzu/shouzu_2.png'
                });
                if(self.szTimer){
                    clearInterval(self.szTimer);
                }
                self.szTimer = setInterval(()=>{
                    $('.user-shouzu-timeout').html(`(${util.timeformatshow(lasttimeup)})`);
                    lasttimeup--;
                    if(lasttimeup<=0){
                        clearInterval(self.szTimer);
                        self.getShowzuTime();
                    }
                },1000);

                $('.user-shouzu-timeout').removeClass('hide');
            }else if(jdata.data.type == 3){
                /** 立即收租 */
                $('.js-user-shouzu-bt').attr({
                    src: '/mex/cbd/img/shouzu/shouzu_3.png'
                });
                $('.user-shouzu-timeout').addClass('hide');
            }
        })
    },
    updateUserInfo: function(){
        var self = this;
        /**获取用户信息 */
        util.ajaxFun('/app/main/getUserInfo',{
        }).done((jdata)=>{
            if(jdata.code == 0){
                self.userinfo = jdata.data;
                $('.js-login-wrap,.js-reg-wrap').addClass('hide');
                $('.js-main-view').removeClass('hide');
                $('.js-jb-show').html(jdata.data.jb);
                $('.js-user-name').html(jdata.data.nickname || '还没名字');
                $('.js-activation_code_num').html(jdata.data.activation_code_num);
                jdata.data.headimgurl && $('.js-user-avatar').attr('src',jdata.data.headimgurl);
                if(jdata.data.is_activated == 1){
                    $('.js-my-jhm').find('.ccc-out').html('已激活').addClass('gray');
                }
            }else{
                $('.js-login-wrap').removeClass('hide');
                $('.js-main-view').addClass('hide');
            }
        });
        /**获取钻石数 */
        util.ajaxFun('/app/sb/getUserZs',{}).done((jdata)=>{
            if(jdata.code == 0){
                $('.js-user-zs').html(jdata.data.zs);
            }
        });
    },
    /** 购买房产 */
    buildMap: function(selectbuildtype){
        var self = this;
        if(!self.curSelectArea.attr('land_id')){
            util.windowToast('请先选择土地');
            return;
        }
        if(isNaN(selectbuildtype)){
            util.windowToast('请先选择建筑类型');
            return;
        }
        util.ajaxPost('/app/main/buyLand',{
            id: self.curSelectArea.attr('land_id'),
            type: selectbuildtype
        }).done((jdata)=>{
            if(jdata.code == 0){
                self.gameviewInit();
                util.windowToast('建筑完成');
            } else if (jdata.code == 1002) {
                self.updateUserInfo();
                $('.js-my-jhm').removeClass('hide');
            }
        })
    },
    /** 获取土地 */
    getUserLands: function(){
        util.ajaxFun('/app/main/getUserLands',{}).done((jdata)=>{
            if(jdata.code == 0 && jdata.data.lands.length > 0){
                var newArr = [],b;
                var arr = jdata.data.lands;
                arr.forEach(function(item, index, array) {
                    var a = Math.floor(index / 4);
                    if (b !== a) {
                        b = a;
                        newArr[a] = new Array();
                    }
                    newArr[a].push(item);         
                });
                console.log('newArr', newArr);
                $('.js-area-wrap').html(pageTpl.maparea({
                    Math: Math,
                    dataarr: newArr
                }));
            }
        })
    },
    /** 获取交易记录 */
    getSalesRecord: function(){
        util.ajaxFun('/app/main/getSalesRecord',{}).done((jdata)=>{
            if(jdata.code == 0){
                $('.js-cc-list').html(pageTpl.salelist({
                    data: jdata.data.orders
                }));
            }
        });
    },
    /** 完成注册 */
    regdone: function(){
        var self = this;
        if(!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test($('.js-mobile').val().replace(/\s+/g,""))){
            util.windowToast('请输入正确手机号');
            return;
        }
        if($('.js-sms-code').val().length < 4){
            util.windowToast('请输入短信验证码');
            return;
        }
        if($('.js-reg-pwd').val().length < 4){
            util.windowToast('请输入密码');
            return;
        }
        util.ajaxPost('/app/main/register',{
            sms_captcha: $('.js-sms-code').val(),
            mobile: $('.js-mobile').val(),
            password: $('.js-reg-pwd').val(),
            tj_mid: util.getURLParam('tj_mid') || ''
        }).done((jdata)=>{
            if(jdata.code == 0){
                util.windowToast('完成注册');
                gameviewInit();
            }
        })

    },
    /** 完成登录 */
    logindone: function(){
        var self = this;
        window.testtoken = '862dc26eff856f42e24037ae8ac6558d';
        if(!/com/.test(window.location.href) && window.testtoken){
            self.gameviewInit();
            return;
        }
        if(!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test($('.js-login-mob').val().replace(/\s+/g,""))){
            util.windowToast('请输入正确手机号');
            return;
        }
        if($('.js-login-pwd').val().length < 4){
            util.windowToast('请输入密码');
            return;
        }
        util.ajaxPost('/app/main/login',{
            mobile: $('.js-login-mob').val(),
            password: $('.js-login-pwd').val()
        }).done((jdata)=>{
            if(jdata.code == 0){
                window.testtoken = jdata.data.token;
                //window.testtoken = '7f76bb56a511792cfe56ccfd7a492fd7';
                if(/com/.test(window.location.href) && util.is_weixn()){
                    setTimeout(()=>{
                        window.location.href = '/app/ashop/up_member_info';
                    }, 2000);
                }
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
        if(!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test($('.js-mobile').val().replace(/\s+/g,""))){
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
    /** 获取粉丝列表 */
    getUserFansList: function(listtype){
        $('.js-fanlist-wrap').html('');
        util.ajaxFun('/app/api/get_fs_tj',{}).done((jdata)=>{
            if(jdata.code == 0){
                $('.js-tuan').html(jdata.data.tuan);
                $('.js-vip').html(jdata.data.vip);
                $('.js-zyj').html(jdata.data.zyj);
            }
        });
        util.ajaxFun('/app/main/getUserFans',{
            type: listtype,
            page: 1,
        }).done((jdata)=>{
            if(jdata.code == 0){
                $('.js-fanlist-wrap').html(pageTpl.fanlist({
                    data: jdata.data.fans
                }))
            }
        })
    },
    bindEven: function(){
        var self = this;
        /** 提现按钮 */
        $('.js-jiaoyi-window').on('click', '.js-list-tixian', function(){
            util.windowToast('请稍后.');
            console.log('self.userinfo.alipay_account', !self.userinfo.alipay_account, self.userinfo.phone);
            if(self.pay_method == 'alipay'){
                !self.userinfo.alipay_account ? window.location.href = '/app/main/zfb?mobnum=' + self.userinfo.phone : window.location.href = $(this).data('aliurl')
            }else{
                window.location.href = $(this).data('txurl');
            }
        });
        /** 购入金币弹窗 */
        $('.js-jiaoyi-in').on('click', ()=>{
            $('.js-jiaoyi-center').removeClass('hide').find('.ccc-value').addClass('hide');
            $('.js-jiaoyi-numout').addClass('hide');
            $('.js-jiaoyi-numin').removeClass('hide');
        });
        /** 购入金币 */
        $('.js-jiaoyi-numin').on('click', ()=>{
            if(!$('.js-jiaoyi-num').val() || isNaN($('.js-jiaoyi-num').val())){
                util.windowToast('请输入购买数量');
                return;
            }
            util.ajaxFun('/app/main/exchangeCoin', {
                type: 1,
                jb: $('.js-jiaoyi-num').val()
            }).done((jdata)=>{
                if(jdata.code == 0){
                    if(util.is_weixn()){
                        window.location.href = jdata.data.pay_url;
                    }else{
                        apppay.pay(jdata.data.bill_id, function(){
                            $('.js-jiaoyi-center,.js-jiaoyi-window').addClass('hide');
                        });
                    }
                }
            })
            //window.location.href = `//cbd.72work.com/app/main/exchangeCoin?type=1&jb=${$('.js-jiaoyi-num').val()}`;
        });
        /** 卖出金币弹窗 */
        $('.js-jiaoyi-out').on('click', ()=>{
            $('.js-jiaoyi-center').removeClass('hide').find('.ccc-value').removeClass('hide');
            $('.js-jiaoyi-numout').removeClass('hide');
            $('.js-jiaoyi-numin').addClass('hide');
        });
        /** 卖出金币 */
        $('.js-jiaoyi-numout').on('click', ()=>{
            if(!$('.js-jiaoyi-num').val() || isNaN($('.js-jiaoyi-num').val())){
                util.windowToast('请输入购买数量');
                return;
            }
            util.ajaxFun('/app/main/exchangeCoin', {
                type: 2,
                jb: $('.js-jiaoyi-num').val()
            }).done((jdata)=>{
                if(jdata.code == 0){
                    util.windowToast('卖出成功');
                    $('.js-jiaoyi-center').addClass('hide');
                    self.updateUserInfo();
                    self.getSalesRecord();
                }
            })
            //window.location.href = `//cbd.72work.com/app/main/exchangeCoin?type=2&jb=${$('.js-jiaoyi-num').val()}`;
        });
        /** 显示交易列表 */
        $('.js-go-jiaoyi').on('click', ()=>{
            self.getSalesRecord();
            self.updateUserInfo();
            $('.js-jiaoyi-window').removeClass('hide');
        });
        /**选地建筑逻辑 */
        $('.js-area-wrap').on('click', '.area-unit', function(){
            self.curSelectArea = $(this);
            if($(this).attr('build_type') == 0){
                $('.select-build-wrap').removeClass('hide');
            }else{
                return;
                $('.js-destory-building').removeClass('hide');
                $('.js-bcj').html('---');
                util.ajaxFun('/app/main/getLandInfo',{
                    land_id:  self.curSelectArea.attr('land_id')
                }).done((jdata)=>{
                    if(jdata.code==0){
                        $('.js-bcj').html(jdata.data.sell_price);
                        $('.js-db-sure').attr('land_id',jdata.data.land_id);
                    }
                })
            }
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
            self.buildMap($('.js-sb-list > .cur').data('type'));
            $('.select-build-wrap').addClass('hide');
        });
        /** 拆迁 */
        $('.js-db-sure').on('click', function(){
            util.ajaxPost('/app/main/sellLand',{
                land_id: $('.js-db-sure').attr('land_id')
            }).done((jdata)=>{
                if(jdata.code == 0){
                    self.gameviewInit();
                    util.windowToast('拆迁完成');
                    $('.js-destory-building').addClass('hide');
                }
            })
        })
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
        if(util.getURLParam('tj_mid')){
            $('.js-login-wrap').addClass('hide');
            $('.js-reg-wrap').removeClass('hide');
            self.qrcodeInit();
        }
         
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
            //$('.js-qr-view').removeClass('hide');
            util.ajaxFun('/app/main/getQRPng',{}).done((jdata)=>{
                if(jdata.code == 0){
                    window.location.href = jdata.data.qr_png_url;
                    // $('.js-main-qr').attr({
                    //     src: jdata.data.qrcode_base64
                    // })
                }
            })
        })
        
        $('.js-gologin-bt').on('click', function(){
            $('.js-login-wrap').removeClass('hide');
            $('.js-reg-wrap').addClass('hide');
        })

        /** 转换用户 */
        $('.js-user-switch').on('click', function(){
            util.ajaxFun('/app/main/logout',{});
            $('.js-login-wrap').removeClass('hide');
            $('.js-main-view').addClass('hide');
        });
        /** 骰宝 */
        $('.js-user-saibao').on('click', function(){
            window.location.href='/app/sb/index';
        });
        /** 激活按钮 */
        $('.js-active').on('click', function(){
            self.updateUserInfo();
            $('.js-my-jhm').removeClass('hide');
        });

        /** 激活 */
        $('.js-my-jhm').on('click','.ccc-out',function(){
            if(self.userinfo.activation_code_num < 1 ){
                util.windowToast('你没有激活码');
                return;
            }
            if(self.userinfo.is_activated != 0){
                util.windowToast('你已激活');
            }else{
                // 激活
                util.ajaxPost('/app/main/activateAccount',{

                }).done((jdata)=>{
                    if(jdata.code == 0){
                        $('.js-my-jhm').addClass('hide');
                        $('.js-jhcg').removeClass('hide');
                        self.updateUserInfo();
                    }
                })
            }
        })

        /** 转赠 */
        $('.js-my-jhm').on('click','.ccc-in',function(){
            if(self.userinfo.activation_code_num < 1 ){
                util.windowToast('你没有激活码');
                return;
            }
            self.updateUserInfo();
            $('.js-zryh-s1').removeClass('hide');
        });
        /** 转赠确认 */
        $('.js-zryh-s1').on('click', '.js-gozr', function(){
            if(!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test($('.js-ccf-tel').val().replace(/\s+/g,""))){
                util.windowToast('请输入正确手机号');
                return;
            }
            if(isNaN($('.js-ccf-num').val())){
                util.windowToast('请输入正确数量');
                return;
            }
            $('.js-ccf2-num').html($('.js-ccf-num').val());
            $('.js-ccf2-tel').html($('.js-ccf-tel').val());
            $('.js-zryh-sure').removeClass('hide');
        });
        /** 转赠完成 */
        $('.js-zrdone').on('click', function(){
            if(!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test($('.js-ccf-tel').val().replace(/\s+/g,""))){
                util.windowToast('请输入正确手机号');
                return;
            }
            if(isNaN($('.js-ccf-num').val())){
                util.windowToast('请输入正确数量');
                return;
            }
            util.ajaxPost('/app/main/transferActivationCode',{
                mobile: $('.js-ccf-tel').val(),
                num: $('.js-ccf-num').val()
            }).done((jdata)=>{
                if(jdata.code == 0){
                    self.updateUserInfo();
                    util.windowToast('转赠成功');
                    $('.js-zrwindow').addClass('hide');
                }
            })
        });
        /** 收租 */
        $('.js-user-shouzu-bt').on('click', function(){
            util.ajaxFun('/app/main/getIncome',{}).done((jdata)=>{
                if(jdata.code == 0){
                    util.windowToast(jdata.msg);
                    self.getShowzuTime();
                    $('.js-shouzu-add').html('+'+jdata.data.jb).removeClass('hide');
                    $('.js-jb-show').html(jdata.data.left_jb);
                    setTimeout(()=>{
                        $('.js-shouzu-add').addClass('hide');
                    }, 2000);
                }
            })
        });

        /** 显示粉丝列表 */
        $('.js-user-fans').on('click', function(){
            self.getUserFansList($('.js-cc-fans-nav > .cur').data('type'));
            $('.js-myfriend-list').removeClass('hide');
        });

        /** 粉丝列表切换 */
        $('.js-cc-fans-nav > .fn-unit').on('click', function(){
            $('.js-cc-fans-nav > .cur').removeClass('cur');
            $(this).addClass('cur');
            self.getUserFansList($('.js-cc-fans-nav > .cur').data('type'));
        });


        $('.js-main-qr').on('click', function(e){
            e.preventDefault();
            e.stopPropagation();
        });
        $('.js-qr-view').on('click', function(){
            $('.js-qr-view').addClass('hide');
            $('.js-main-view').removeClass('hide');
        })
        /** 通用关闭父弹窗 */
        $('.js-cc-close').on('click', function(){
            $(this).parents('.common-client-wrap').addClass('hide');
        })
    }
}

window.onload = function(){
    setTimeout(()=>{
        app.init();
    },800)

}