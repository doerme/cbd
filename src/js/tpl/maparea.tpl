{{each dataarr as vrr irr}}
<div class="area-wrap-block">
    {{each vrr as v i}}
        <div 
        build_type={{v.build_type}} 
        land_id={{v.land_id}} 
        uid={{v.uid}} 
        class="area-unit {{if v.build_type > 0}} build {{/if}}"
        >
            {{if v.build_type == 1}}
            <img class="shop t71" src="//cbd.tcpan.com/mex/cbd/img/page/cbd/shop-71.png"/>
            {{else if  v.build_type == 2}}
            <img class="shop thg" src="//cbd.tcpan.com/mex/cbd/img/page/cbd/shop-hg.png"/>
            {{else if  v.build_type == 3}}
            <img class="shop tmv" src="//cbd.tcpan.com/mex/cbd/img/page/cbd/shop-mv.png"/>
            {{else if  v.build_type == 4}}
            <img class="shop tcs" src="//cbd.tcpan.com/mex/cbd/img/page/cbd/shop-cs.png"/>
            {{else if  v.build_type == 5}}
            <img class="shop t4s" src="//cbd.tcpan.com/mex/cbd/img/page/cbd/shop-4s.png"/>
            {{/if}}
        </div>
    {{/each}}
</div>
{{/each}}