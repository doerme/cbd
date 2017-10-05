import util from './util.js';
export default {
    pay: function(orderid, cbfun) {
        $.get({
            url: `/app/alipay/index/${orderid}`
        }).done((jdata)=>{
            if(jdata.code == 0){
                appExec.callHandler('alipay', JSON.stringify(jdata.data.order_string) , function(rsstring){
                    if(rsstring == 1){
                        cbfun();
                    }else{
                        util.windowToast('APP发起支付失败');
                    }
                });
            } else {
                util.windowToast(jdata.msg);
            }
        }).fail(()=>{
            util.windowToast('获取接口状态异常');
        })
        
    }
}