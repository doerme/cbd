/*TMODJS:{"version":128,"md5":"5ee44b4b4eb44ed8a7d0d132149546fd"}*/
template("/Users/xiaominghari/Documents/wanrenqun/cbd/cbd/src/js/tpl/salelist",function(a){"use strict";var b=this,c=(b.$helpers,b.$each),d=a.data,e=(a.v,a.i,b.$escape),f="";return c(d,function(a){f+=' <li> <span class="desc">',f+=e(a.content),f+="</span> ",a.type>0?(f+=' <span class="num red">+',f+=e(a.je),f+="</span> "):(f+=' <span class="num green">-',f+=e(a.je),f+="</span> "),f+=" ","\u63d0\u73b0"==a.state?(f+=' <a href="javascript:;" data-aliurl = "',f+=e(a.alipay_tx_url),f+='" data-txurl = "',f+=e(a.tx_url),f+='" class="state tixian js-list-tixian">',f+=e(a.state),f+="</a> "):(f+=' <span class="state yellow">',f+=e(a.state),f+="</span> "),f+=" </li> "}),new String(f)});