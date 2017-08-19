# CBD

## FTP路径
```
/public/application/views/main/index.php

http://cbd.72work.com/mex/cbd/img/page/loading.png

/public/mex/cbd

```
## 测试地址

```
http://cbd.72work.com/app/main/test

/public/mex/testcbd

/public/application/views/main/test.php
```


## 客户端联调方法
```
webView.registerHandler("wxpay", new BridgeHandler() {
    @Override
    public void handler(String orderInfo, CallBackFunction function) {
        Log.i(tag, "wxpay" );
       // orderInfo="{\"appid\":\"wxc95d506668614104\",\"partnerid\":\"1439443702\",\"prepayid\":\"wx201702261307421e0db535dd0253077180\",\"noncestr\":\"58b2629ecd97d\",\"timestamp\":1488085662,\"package\":\"Sign=WXPay\",\"sign\":\"05428B2EBAC3EB079AA5535892402CE5\"}";
        if(AbStrUtil.isEmpty(orderInfo)) return;
        WxPay.wxpay(ctx, orderInfo);
        wxpayCallBack = function;
    }
});


req.appId         = json.getString("appid");
req.partnerId     = json.getString("partnerid");
req.prepayId      = json.getString("prepayid");
req.nonceStr      = json.getString("noncestr");
req.timeStamp     = json.getString("timestamp");
req.packageValue   = json.getString("package");
req.sign         = json.getString("sign");
```