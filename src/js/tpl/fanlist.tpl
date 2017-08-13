{{each data as v i}}
<li>
    <img class="fl-avatar" src="{{v.headimgurl}}" alt="">
    <div class="fl-name">{{v.nickname}}</div>
    {{if v.is_vip == 1}}
        <div class="fl-vip"></div>
    {{/if}}
</li>
{{/each}}