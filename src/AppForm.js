import './App.scss';
//import './index.css';
import FormioPageBreak from "./CustomComponent/PageBreak/PageBreak";
import SdcFile from "./CustomComponent/FileSdc/SdcFile";

//import Input from "./CustomComponent/Input/Input";
//import "./customTemplates/use";

import bootstrapItalia from '@saba90/bootstrap-italia/bootstrapItalia';
import {Form, Templates, Formio, Components} from "@formio/react";
//import Button from "./customTemplates/components/Button/Button";
//Formio.use(FormioPageBreak);
//Formio.registerComponent('pagebreak', FormioPageBreak);
//Formio.registerComponent("textfield", Input);
//Formio.registerComponent("sdcfile", SdcFile);
//Formio.registerComponent("button1", Button);
Components.addComponent('pagebreak',FormioPageBreak)
Components.addComponent('sdcfile',SdcFile)
Formio.use(bootstrapItalia);

Templates.framework = bootstrapItalia

/*Templates.current = {
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
};*/
console.log(Templates.current )
function App({url,readOnly,submission,onChange}) {

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
