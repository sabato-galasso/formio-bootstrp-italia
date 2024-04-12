import { Components } from "formiojs";
import Base from 'formiojs/components/_classes/component/Component';


const InitialButton = Components.components.textfield;

export default class Button extends InitialButton {


  static schema() {
    return Base.schema({
      type: 'textfield'
    });
  }

  static get builderInfo() {
    return {
      title: 'My Text Field2',
      group: 'basic',
      icon: 'fa fa-bath',
      weight: 0,
      documentation: 'http://help.form.io/userguide/#textfield',
      schema: Button.schema()
    };
  }



  /**
   * This method is used to render a component as an HTML string. This method uses
   * the template system (see Form Templates documentation) to take a template
   * and then render this as an HTML string.
   *
   * @param content - Important for nested components that receive the "contents"
   *                  of their children as an HTML string that should be injected
   *                  in the {{ content }} token of the template.
   *
   * @return - An HTML string of this component.
   */
  render(content) {
    debugger
    return super.render("<div>This is a custom component!</div>");
  }

}
