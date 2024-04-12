import React, {Component} from "react";
import settingsForm from "./Toggle.settingsForm";
import {Components, ReactComponent} from "@formio/react";
import {Input} from "design-react-kit";
import {createRoot} from "react-dom/client";

const TextFieldComponent = Components.components.textfield;

/**
 * An example React component
 *
 * Replace this with your custom react component. It needs to have two things.
 * 1. The value should be stored is state as "value"
 * 2. When the value changes, call props.onChange(null, newValue);
 *
 * This component is very simple. When clicked, it will set its value to "Changed".
 */
const ToggleCustomComp = class extends Component {


  constructor(props) {
    super(props);
    console.log('props',props)

    this.state = {
      value: props.value,
      label: props.component.label
    };
  }

  setValue = () => {
    this.setState(
      prevState => ({ value: !prevState.value }),
      () => this.props.onChange(null, this.state.value)
    );
  };



  render() {

    const handleChange = (event) => {
      this.props.onChange(event.target.value)
    };

    return (
/*      <label class="switch">
        <input type="checkbox" onClick={this.setValue} />
        <span class="slider round" />
      </label>*/
    <Input type='text' label={this.props.component.label} name={'data[name]'}
           infoText='Inserisci almeno 8 caratteri e una lettera maiuscola'
           value={this.props.value}
           onChange={(event) => {
      handleChange(event);
    }}  />
    );
  }
};

export default class Toggle extends ReactComponent {

  /**
   * This function tells the form builder about your component. It's name, icon and what group it should be in.
   *
   * @returns {{title: string, icon: string, group: string, documentation: string, weight: number, schema: *}}
   */
  static get builderInfo() {
    return {
      title: "Textfield",
      icon: "square",
      group: "Data",
      documentation: "",
      weight: -10,
      schema: Toggle.schema()
    };
  }

  /**
   * This function is the default settings for the component. At a minimum you want to set the type to the registered
   * type of your component (i.e. when you call Components.setComponent('type', MyComponent) these types should match.
   *
   * @param sources
   * @returns {*}
   */
  static schema() {
    return ReactComponent.schema({
      type: "textfield1"
    });
  }

  /*
   * Defines the settingsForm when editing a component in the builder.
   */
  static editForm = settingsForm;

  /**
   * This function is called when the DIV has been rendered and added to the DOM. You can now instantiate the react component.
   *
   * @param DOMElement
   * #returns ReactInstance
   */
  attachReact(element) {
    const root = createRoot(element);
    root.render(<ToggleCustomComp
        component={this.component} // These are the component settings if you want to use them to render the component.
        value={this.getValue()} // The starting value of the component.
        onChange={this.updateValue} // The onChange event to call when the value changes.
    />);
  }

  /**
   * Automatically detach any react components.
   *
   * @param element
   */
  detachReact(element) {
    if (element) {
      const root = createRoot(element);
      root.unmount();
    }
  }

  /**
   * Get the value of the component from the dom elements.
   *
   * @returns {Array}
   */
  getValue() {
    return this.dataValue;
  }

}
