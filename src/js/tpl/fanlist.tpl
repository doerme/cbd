{{each data as v i}}
<li>
    <img class="fl-avatar" src="{{v.headimgurl}}" alt="">
    <div class="fl-name">{{v.nickname || '还没名字'}}</div>
    {{if v.is_vip == 1}}
        <div class="fl-vip">VIP</div>
    {{/if}}
</li>
{{/each}}