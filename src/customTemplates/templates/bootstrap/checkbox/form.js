const form = (ctx) => {
    let checked
    if(ctx.checked){
        checked = 'checked=true'
    }else{
    }

    let description
    if(ctx.component.description) {
        description = `aria-describedby="d-${ctx.instance.id}-${ctx.component.key}"`
    }

    let tooltip = ''
    if(ctx.component.tooltip){
        tooltip = `<i ref="tooltip" tabIndex="0" class="${ctx.iconClass('question-sign')} text-muted" data-tooltip="${ctx.component.tooltip}"></i>`
    }
    let labelIsHidden = ''
    if(!ctx.self.labelIsHidden()){
        labelIsHidden = `<span>${ctx.input.label}</span>`
    }

    console.log('ctx1',ctx)
    // How to know what's inside the ctx object?
    // My first idea was too look at the existing components:
    // https://github.com/formio/formio.js/blob/master/src/templates/bootstrap/button/form.ejs
    // But I wonder, if there is any documentation per component?
    /* <div class="form-check">
    <${ctx.input.type}
      ref="input"
       ${getAttr(ctx.input.attr)}
       type="checkbox"
      ${ctx.checked ? 'checked=true' : null}
      aria-required="${ctx.component.validate.required}"
      ${ctx.component.description ? 'aria-describedby="d-{{ctx.instance.id}}-{{ctx.component.key}}"' : null}
      >
    ${!ctx.self.labelIsHidden() ?<span>{ctx.input.label}</span> : null}
    ${ctx.input.content}
    </${ctx.input.type}}>
 <label class="${ctx.input.labelClass}"> </label>
  ${ctx.component.tooltip ?
        <i ref="tooltip" tabIndex="0" className="{ctx.iconClass('question-sign')} text-muted" data-tooltip="{ctx.component.tooltip}"></i> : null}
</div>*/
    return `
 <div class="form-check">
    <${ctx.input.type} id="${ctx.id}-oc" type="checkbox" ref="input" ${checked} aria-required="${ctx.component.validate.required}" ${description} > </${ctx.input.type}>
    <label for="${ctx.id}-oc" class="${ctx.input.labelClass}">${ctx.input.label}</label>
    ${tooltip}
  </div>
  `;
};

export default form;
