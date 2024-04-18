import App from './AppForm';
import r2wc from "@r2wc/react-to-web-component"
import AppFormBuilder from "./AppFormBuilder";
const WebAppForm = r2wc(App, {
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

const WebAppformBuilder = r2wc(AppFormBuilder, {
    props: {
        url: "string",
        noAlert: "boolean",
        hide: "boolean",
        readOnly: "boolean",
        falseProp: "boolean",
        arrayProp: "json",
        objProp: "json",
        onChange: "function",
    },
})

customElements.define("form-app", WebAppForm)
customElements.define("form-builder", WebAppformBuilder)
