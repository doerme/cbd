export default {
    pay: function() {
        appExec.callHandler('alipay', '2222' , function(rsstring){
            console.log(rsstring);
        });
    }
}