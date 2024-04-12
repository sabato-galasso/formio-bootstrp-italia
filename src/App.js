import './App.scss';
import './index.css';
import FormioPageBreak from "./CustomComponent/PageBreak/PageBreak";
import SdcFile from "./CustomComponent/FileSdc/SdcFile";
import input from './customTemplates/templates/bootstrap/input/form.js'
import checkbox from './customTemplates/templates/bootstrap/checkbox/form.js'
import radio from './customTemplates/templates/bootstrap/radio/form.js'
import component from './customTemplates/templates/bootstrap/component/form.js'
import label from './customTemplates/templates/bootstrap/label/form.js'
import fieldset from './customTemplates/templates/bootstrap/fieldset/index.js'
//import Input from "./CustomComponent/Input/Input";
//import "./customTemplates/use";
import {Form, Templates,Formio} from "@formio/react";
//import Button from "./customTemplates/components/Button/Button";
//Formio.use(FormioPageBreak);
Formio.registerComponent('pagebreak', FormioPageBreak);
//Formio.registerComponent("textfield", Input);
//Formio.registerComponent("sdcfile", SdcFile);
//Formio.registerComponent("button1", Button);


Templates.current = {
        input: {
            form: (ctx) => input(ctx),
        },
    checkbox: {
        form: (ctx) => checkbox(ctx),
    },
    radio:{
        form: (ctx) => radio(ctx),
    }
    ,
    component:{
        form: (ctx) => component(ctx),
    },
    label: {
        form: (ctx) => label(ctx),
    },
    fieldset:{
        form: (ctx) => fieldset(ctx),
    }
};
console.log(Templates.current )
function App({url,readOnly,submission,onChange}) {
  console.log(url)
    const options = {
        readOnly: readOnly,
        noAlerts:false,
        hide: true
    }


  return (
              <div className="App">
                  <Form src={url} options={options} submission={submission} onChange={onChange}/>
              </div>
  );
}

export default App;
