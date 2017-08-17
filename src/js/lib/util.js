import LegoToast from '../legolib/lego-toast/0.0.1/legoToast.min.js';
import wechatShare from './wechatShare.js';
export default {
    apiHost: '//cbd.72work.com',
    legoToast: new LegoToast({
        msg        : "操作成功",
        time       : 1200,
        extraclass : "extraclass"
    }),
    windowToast: function(msg, mtime){
        this.legoToast.changeText(msg || 'toast'); // 修改文案
        this.legoToast.open(); // 再次打开
    },
    ajaxFun: function(url, requestData){
        var self = this;
        return $.ajax({
            url: this.apiHost + url,
            type: 'get',
            dataType: 'jsonp',
            timeout: 8000,
            data: $.extend(requestData,{token: window.testtoken})
        }).done((jdata)=>{
            //console.log('global done', jdata);
            if(jdata.code == -1 || jdata.code == '-1'){
                self.setCookie('ci_session','');
            }
            if(jdata.code != 0){
                self.windowToast(jdata.msg || '操作失败，请重试');
            }
        }).fail((jdata)=>{
            self.windowToast(jdata.msg || '操作失败，请重试');
        })
    },
    ajaxPost: function(url, requestData){
        var self = this;
        return $.ajax({
            url: this.apiHost + url +'?token=' + window.testtoken,
            type: 'POST',
            timeout: 8000,
            data: $.extend(requestData,{token: window.testtoken})
        }).done((jdata)=>{
            if(jdata.code == -1 || jdata.code == '-1'){
                self.setCookie('ci_session','');
            }
            if(jdata.code != 0){
                self.windowToast(jdata.msg || '操作失败，请重试');
            }
        }).fail((jdata)=>{
            self.windowToast(jdata.msg || '操作失败，请重试');
        })
    },
    wechatShareInit: function(jdata){
        wechatShare(jdata);
    },
    getURLParam: function(name, url) {
        var re = new RegExp("[\\?&#]" + name + "=([^&#]+)", "gi");
        var ma = (url || location.href).match(re);
        var strArr;
        if (ma && ma.length > 0) {
            strArr = (ma[ma.length - 1]);
            var _index = strArr.indexOf("=");
            return strArr.substring(_index + 1);
        }
        return '';
    },
    setCookie: function(c_name, value, expiredays) {
        try {
            var exdate = new Date()
            exdate.setDate(exdate.getDate() + expiredays)
            document.cookie = c_name + "=" + escape(value) +
                ((expiredays == null) ? "" : ";domain=.mezhibo.com;path=/;expires=" + exdate.toGMTString())
        } catch (e) {
            console.error('setCookie e', e)
        }
    },
    getCookie: function(c_name) {
        var c_start = null,
            c_end = null;
        try {
            if (document.cookie && document.cookie.length > 0) {
                c_start = document.cookie.indexOf(c_name + "=")
                if (c_start != -1) {
                    c_start = c_start + c_name.length + 1
                    c_end = document.cookie.indexOf(";", c_start)
                    if (c_end == -1) c_end = document.cookie.length
                    return unescape(document.cookie.substring(c_start, c_end));
                }
            }
            return "";
        } catch (e) {
            console.error('getCookie e', e)
            return "";
        }
    },
}