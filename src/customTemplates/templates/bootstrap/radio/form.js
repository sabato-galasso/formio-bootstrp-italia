const getAttr = (attr) => {
    const attrs = [];

    Object.keys(attr).forEach((key) => {
        attrs.push(`${key}="${attr[key]}"`);
    });

    return attrs.join(" ");
};
const form = (ctx) => {

    let options = ctx.values.map(function (item,index) {
        // return `<div class="${ctx.input.attr.type} ${ ctx.component.optionsLabelPosition && ctx.component.optionsLabelPosition !== 'right' ? 'pl-0' : ''} form-check${ctx.inline ? '-inline' : ''}" ref="wrapper">`
        return `  <div class="form-check ${ctx.inline ? 'form-check-inline' : ''}">
    <input  value="${item.value}" ${getAttr(ctx.input.attr)} name="gruppo-${ctx.id}" type="radio" 
    id="${ctx.instance.root && ctx.instance.root.id}-${ctx.id}}-${ctx.row}-${(typeof item.value === 'object') ? item.value + '-' + index : item.value}"  
    ref="input"  role="${ctx.component.type === 'selectboxes' ? 'checkbox' : 'radio'}"
      ${(ctx.value && (ctx.value === item.value || (typeof ctx.value === 'object' && ctx.value.hasOwnProperty(item.value) && ctx.value[item.value]))) ? `checked=true`: ''}
      ${(item.disabled) ? `disabled=true`: ''}
    ">
    <label for="${ctx.instance.root && ctx.instance.root.id}-${ctx.id}}-${ctx.row}-${(typeof item.value === 'object') ? item.value + '-' + index : item.value}">${ctx.t(item.label, { _userInput: true })}</label>
  </div>`

    })

    console.log('ctx1', ctx)
    // How to know what's inside the ctx object?
    // My first idea was too look at the existing components:
    // https://github.com/formio/formio.js/blob/master/src/templates/bootstrap/button/form.ejs
    // But I wonder, if there is any documentation per component?
    /*
    <div
  class="form-radio radio"
  ref="radioGroup"
  role="{{ctx.component.type === 'selectboxes' ? 'group' : 'radiogroup'}}"
  aria-required="{{ctx.input.component.validate.required}}"
  aria-labelledby="l-{{ctx.instance.id}}-{{ctx.component.key}}"
  {% if (ctx.component.description) { %}
    aria-describedby="d-{{ctx.instance.id}}-{{ctx.component.key}}"
  {% } %}
>
  {% ctx.values.forEach(function(item, index) { %}
  <div class="{{ctx.input.attr.type}} {{ ctx.component.optionsLabelPosition && ctx.component.optionsLabelPosition !== 'right' ? 'pl-0' : ''}} form-check{{ctx.inline ? '-inline' : ''}}" ref="wrapper">
    <label class="form-check-label label-position-{{ ctx.component.optionsLabelPosition }}" for="{{ctx.instance.root && ctx.instance.root.id}}-{{ctx.id}}-{{ctx.row}}-{{(typeof item.value === 'object') ? item.value + '-' + index : item.value}}">
      {% if (ctx.component.optionsLabelPosition === 'left' || ctx.component.optionsLabelPosition === 'top') { %}
      <span>{{ctx.t(item.label, { _userInput: true })}}</span>
      {% } %}
      <{{ctx.input.type}}
        ref="input"
        {% for (var attr in ctx.input.attr) { %}
        {{attr}}="{{ctx.input.attr[attr]}}"
        {% } %}
        value="{{item.value}}"
        {% if (ctx.value && (ctx.value === item.value || (typeof ctx.value === 'object' && ctx.value.hasOwnProperty(item.value) && ctx.value[item.value]))) { %}
          checked=true
        {% } %}
        {% if (item.disabled) { %}
          disabled=true
        {% } %}
        id="{{ctx.instance.root && ctx.instance.root.id}}-{{ctx.id}}-{{ctx.row}}-{{(typeof item.value === 'object') ? item.value + '-' + index : item.value}}"
        role="{{ctx.component.type === 'selectboxes' ? 'checkbox' : 'radio'}}"
      >
      {% if (!ctx.component.optionsLabelPosition || ctx.component.optionsLabelPosition === 'right' || ctx.component.optionsLabelPosition === 'bottom') { %}
      <span>{{ctx.t(item.label, { _userInput: true })}}</span>
      {% } %}
    </label>
  </div>
  {% }) %}
</div>
    * */
    return `
    <div>
 ${options.join('')}
 </div>
  `;
};

export default form;
