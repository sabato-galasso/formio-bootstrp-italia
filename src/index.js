import App from './App';
import r2wc from "@r2wc/react-to-web-component"
import App2 from "./App2";
import DatePickerInput from "./DatePicker";
const WebApp = r2wc(App, {
    props: {
        url: "string",
        noAlert: "boolean",
        hide: "boolean",
        readOnly: "boolean",
        falseProp: "boolean",
        arrayProp: "json",
        submission: "json",
        onChange: "function",
    },
})

const WebApp2 = r2wc(App2, {
    props: {
        url: "string",
        noAlert: "boolean",
        hide: "boolean",
        readOnly: "boolean",
        falseProp: "boolean",
        arrayProp: "json",
        objProp: "json",
        funcProp: "function",
    },
})

/*const DatePicker = r2wc(DatePickerInput, {
    props: {
        url: "string",
        noAlert: "boolean",
        hide: "boolean",
        readOnly: "boolean",
        falseProp: "boolean",
        arrayProp: "json",
        objProp: "json",
        funcProp: "function",
    },
})*/

customElements.define("web-app", WebApp)
customElements.define("web-app2", WebApp2)
//customElements.define("date-picker", DatePicker)
