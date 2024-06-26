/*const form = (ctx) => {
  // How to know what's inside the ctx object?
  // My first idea was too look at the existing components:
  // https://github.com/formio/formio.js/blob/master/src/templates/bootstrap/button/form.ejs
  // But I wonder, if there is any documentation per component?
  return `
{% if (ctx.prefix || ctx.suffix) { %}
<div class="input-group">
  {% } %}
  {% if (ctx.prefix) { %}
    <div class="input-group-prepend" ref="prefix">
      <span class="input-group-text">
        {% if(ctx.prefix instanceof HTMLElement){ %}
          {{ ctx.t(ctx.prefix.outerHTML, { _userInput: true }) }}
        {% } else{ %}
          {{ ctx.t(ctx.prefix, { _userInput: true }) }}
        {% } %}
      </span>
    </div>
  {% } %}
  {% if (!ctx.component.editor && !ctx.component.wysiwyg) { %}
    <{{ctx.input.type}}
      ref="{{ctx.input.ref ? ctx.input.ref : 'input'}}"
      {% for (var attr in ctx.input.attr) { %}
        {{attr}}="{{ctx.input.attr[attr]}}"
      {% } %}
      id="{{ctx.instance.id}}-{{ctx.component.key}}"
      aria-labelledby="l-{{ctx.instance.id}}-{{ctx.component.key}} {% if (ctx.component.description) { %}d-{{ctx.instance.id}}-{{ctx.component.key}}{% } %}"
      aria-required="{{ctx.input.ref === 'input' || !ctx.input.ref ? ctx.component.validate.required :
        ctx.component.fields && ctx.component.fields[ctx.input.ref] && ctx.component.fields[ctx.input.ref].required || false}}"
    >{{ctx.input.content}}</{{ctx.input.type}}>
    {% if (ctx.hasValueMaskInput) { %}
      <input ref="valueMaskInput" />
    {% } %}
{% } %}
{% if (ctx.component.editor || ctx.component.wysiwyg) { %}
  <div ref="input"></div>
{% } %}
{% if (ctx.component.type === 'datetime') { %}
<span aria-live="assertive" id="{{ctx.instance.id}}-liveRegion" class="sr-only" ref="liveRegion"></span>
{% } %}
{% if (ctx.suffix) { %}
  <div class="input-group-append" ref="suffix">
    <span class="input-group-text">
      {% if(ctx.suffix instanceof HTMLElement){ %}
        {{ ctx.t(ctx.suffix.outerHTML, { _userInput: true }) }}
      {% } else{ %}
        {{ ctx.t(ctx.suffix, { _userInput: true }) }}
      {% } %}
    </span>
  </div>
{% } %}
{% if (ctx.prefix || ctx.suffix) { %}
  </div>
{% } %}
{% if (ctx.component.showCharCount || ctx.component.showWordCount) { %}
<div class="form-text {{ctx.component.description ? 'pull-right' : 'text-right'}}">
  {% if (ctx.component.showCharCount) { %}
  <span class="text-muted" ref="charcount" aria-live="polite"></span>
  {% } %}
  {% if (ctx.component.showWordCount) { %}
  <span class="text-muted" ref="wordcount" aria-live="polite"></span>
  {% } %}
</div>
{% } %}*/

const form = (ctx) => {
    console.log('ctx1',ctx)
    let styles = ''
    if(ctx.styles){
        styles = `${ctx.styles}`
    }

    let visible = ''
    if(ctx.visible){
        visible = `${ctx.children} <div ref="messageContainer" class="formio-errors invalid-feedback 1"></div>`
    }

    return `
<div id="${ctx.id}" class="${ctx.classes} my-5" styles="${styles}" ref="component">
  ${visible}
</div>
  `;
};

export default form;
