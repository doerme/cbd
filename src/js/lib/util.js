import LegoToast from '../legolib/lego-toast/0.0.1/legoToast.min.js';
export default {
    apiHost: '//cbd.tcpan.com',
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
                
            }
            if(jdata.code != 0){
                self.windowToast(jdata.msg || '操作失败，请重试');
            }
        })
    },
    ajaxPost: function(url, requestData){
        var self = this;
        return $.ajax({
            url: this.apiHost + url,
            type: 'POST',
            timeout: 8000,
            data: $.extend(requestData,{token: window.testtoken})
        }).done((jdata)=>{
            if(jdata.code == -1 || jdata.code == '-1'){
                
            }
            if(jdata.code != 0){
                self.windowToast(jdata.msg || '操作失败，请重试');
            }
        }).fail((jdata)=>{
            
        })
    },
}