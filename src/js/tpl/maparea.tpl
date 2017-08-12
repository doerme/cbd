{{each dataarr as vrr irr}}
<div class="area-wrap-block">
    {{each vrr as v i}}
        <div 
        build_type={{v.build_type}} 
        land_id={{v.land_id}} 
        uid={{v.uid}} 
        class="area-unit"></div>
    {{/each}}
</div>
{{/each}}