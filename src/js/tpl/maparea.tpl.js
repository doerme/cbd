/*TMODJS:{"version":173,"md5":"f24d7e65083ff14b28e0ff7d5acadec4"}*/
template("/Users/xiaominghari/Documents/wanrenqun/cbd/cbd/src/js/tpl/maparea",function(a){"use strict";var b=this,c=(b.$helpers,b.$each),d=a.dataarr,e=(a.vrr,a.irr,a.v,a.i,b.$escape),f=a.Math,g="";return c(d,function(a,b){g+=' <div class="area-wrap-block"> ',c(a,function(a){g+=" <div build_type=",g+=e(a.build_type),g+=" land_id=",g+=e(a.land_id),g+=" uid=",g+=e(a.uid),g+=' class="area-unit ',a.build_type>0&&(g+=" build "),g+='" > ',1==a.build_type?g+=' <img class="shop t71" src="/mex/cbd/img/page/cbd/shop-71.png"/> ':2==a.build_type?g+=' <img class="shop thg" src="/mex/cbd/img/page/cbd/shop-hg.png"/> ':3==a.build_type?g+=' <img class="shop tmv" src="/mex/cbd/img/page/cbd/shop-mv.png"/> ':4==a.build_type?g+=' <img class="shop tcs" src="/mex/cbd/img/page/cbd/shop-cs.png"/> ':5==a.build_type&&(g+=' <img class="shop t4s" src="/mex/cbd/img/page/cbd/shop-4s.png"/> '),g+=" </div> "}),g+=" ",0==b%2?g+=' <div class="topdown-wrap carmovedown topadapt2 pt-delay4"> <img class="car-rd1 car carmoveright pt-delay4 " src="/mex/cbd/img/decoration/car-rd1.png" alt=""> </div> <div class="topdown-wrap carmovedown topadapt1 pt-delay8"> <img class="car-ld1 car carmoveleft pt-delay8" src="/mex/cbd/img/decoration/car-ld1.png" alt=""> </div> ':(g+=' <div class="topdown-wrap carmovetop topadapt1 pt-delay6"> <img class="car-rt',g+=e(f.ceil(b/2)%3+1),g+=' car carmoveright pt-delay6" src="/mex/cbd/img/decoration/car-rt',g+=e(f.ceil(b/2)%3+1),g+='.png" alt=""> </div> <div class="topdown-wrap carmovetop topadapt1"> <img class="car-lt',g+=e(f.ceil(b/2)%2+1),g+=' car carmoveleft" src="/mex/cbd/img/decoration/car-lt',g+=e(f.ceil(b/2)%2+1),g+='.png" alt=""> </div> '),g+=' <div class="street-block-add"></div> </div> '}),new String(g)});