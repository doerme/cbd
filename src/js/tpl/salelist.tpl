{{each data as v i}}
<li>
    <span class="desc">{{v.content}}</span>
    {{if v.type > 0}}
    <span class="num red">+{{v.je}}</span>
    {{else}}
    <span class="num green">-{{v.je}}</span>
    {{/if}}
    <span class="state yellow">{{v.state}}</span>
</li>
{{/each}}