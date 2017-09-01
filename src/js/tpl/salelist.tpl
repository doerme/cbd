{{each data as v i}}
<li>
    <span class="desc">{{v.content}}</span>
    {{if v.type > 0}}
    <span class="num red">+{{v.je}}</span>
    {{else}}
    <span class="num green">-{{v.je}}</span>
    {{/if}}
    {{if v.state == '提现'}}
    <a href="javascript:;" data-aliurl = "{{v.alipay_tx_url}}" data-txurl = "{{v.tx_url}}" class="state tixian js-list-tixian">{{v.state}}</a>
    {{else}}
    <span class="state yellow">{{v.state}}</span>
    {{/if}}
</li>
{{/each}}