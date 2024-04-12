import Base from 'formiojs/components/_classes/component/Component';
import Components from 'formiojs/components/Components'
const TextFieldComponent = require('formiojs/components/textfield/TextField').default;

export default class MyTextFieldComponent extends TextFieldComponent {

    static schema() {
        return Base.schema({
            type: 'mytextfield',
            label: 'My Text Field3',
            placeholder: 'Insert text here...',
        });
    }

    static get builderInfo() {
        return {
            title: 'My Text Field3',
            group: 'basic',
            icon: 'fa fa-bath',
            weight: 0,
            documentation: 'http://help.form.io/userguide/#textfield',
            schema: MyTextFieldComponent.schema()
        };
    }
}

Components.addComponent('mytextfield', MyTextFieldComponent);
