// How to know what's inside the ctx object?
// My first idea was too look at the existing components:
// https://github.com/formio/formio.js/blob/4.19.x/src/templates/bootstrap/label/form.ejs
// But I wonder, if there is any documentation per component?

const form = (ctx) => {
    console.log('label',ctx)
    return `
<label
  ref="label"
  class="col-form-label ${ctx.label.className}"
  for="${ctx.instance.id}-${ctx.component.key}"
  id="l-${ctx.instance.id}-${ctx.component.key}"
>
  ${ ctx.t(ctx.component.label, { _userInput: true }) }
  ${(ctx.component.type === 'number' || ctx.component.type === 'phoneNumber' || ctx.component.type === 'currency') ? `<span class="sr-only">${ctx.t('numeric only')}</span>` : ''}
  ${(ctx.component.tooltip) ? `<i ref="tooltip" tabindex="0" class="${ctx.iconClass('question-sign')}} text-muted" data-tooltip="${ctx.component.tooltip}"></i>` : ''}
</label>
  `;
};

export default form;
