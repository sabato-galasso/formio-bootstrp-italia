import './App.scss';
import {FormBuilder,Components} from "@formio/react";
import components from "./Custom";

Components.setComponents(components);
function AppFormBuilder({url,readOnly,submission,onChange}) {
  console.log(url)

  return (
        <div className="App">
          <FormBuilder
              form={
                {
                  "display": "wizard",
                  "type": "form",
                  "components": [
                    {
                      "title": "Richiedi assistenza",
                      "breadcrumbClickable": true,
                      "buttonSettings": {
                        "previous": true,
                        "cancel": true,
                        "next": true
                      },
                      "navigateOnEnter": false,
                      "saveOnEnter": false,
                      "scrollToTop": false,
                      "collapsible": false,
                      "key": "page1",
                      "type": "panel",
                      "label": "Page 1",
                      "components": [
                        {
                          "legend": "Richiedente",
                          "key": "applicant_fieldset",
                          "type": "fieldset",
                          "label": "Applicant",
                          "input": false,
                          "tableView": false,
                          "components": [
                            {
                              "label": "Form",
                              "tableView": true,
                              "form": "605dd397a406c00020e9eef6",
                              "useOriginalRevision": false,
                              "reference": false,
                              "key": "applicant",
                              "type": "form",
                              "input": true,
                              "lazyLoad": true
                            },
                            {
                              "label": "Email",
                              "description": "Inserisci la tua email",
                              "tableView": true,
                              "key": "email",
                              "type": "email",
                              "input": true
                            }
                          ]
                        },
                        {
                          "label": "PageBreak",
                          "tableView": false,
                          "key": "pageBreak",
                          "type": "pagebreak",
                          "input": true
                        },
                        {
                          "legend": "Richiesta",
                          "key": "request_fieldset",
                          "type": "fieldset",
                          "label": "Request",
                          "input": false,
                          "tableView": false,
                          "components": [
                            {
                              "label": "Dettagli",
                              "description": "Inserire massimo 600 caratteri",
                              "tableView": true,
                              "validate": {
                                "maxLength": 600
                              },
                              "key": "details",
                              "type": "textarea",
                              "input": true
                            }
                          ]
                        },
                        {
                          "label": "Privacy text",
                          "attrs": [
                            {
                              "attr": "",
                              "value": ""
                            }
                          ],
                          "content": "Per i dettagli sul trattamento dei dati personali consulta l’informativa sulla privacy del sito.",
                          "refreshOnChange": false,
                          "key": "privacy_text",
                          "type": "htmlelement",
                          "input": false,
                          "tableView": false
                        },
                        {
                          "label": "Ho letto e compreso l'informativa sulla privacy",
                          "tableView": false,
                          "defaultValue": false,
                          "key": "privacy",
                          "type": "checkbox",
                          "input": true
                        }
                      ],
                      "input": false,
                      "tableView": false
                    }
                  ],
                  "tags": [
                    "custom"
                  ],
                  "title": "helpdesk",
                  "name": "helpdesk",
                  "path": "helpdesk",
                  "description": "helpdesk"
                }

              }
              options={{
                builder: {
                  basic: false,
                  advanced: false,
                  data: false,
                  layout: false,
                  premium: false,
                  resource: false,
                  customBasic: {
                    title: 'Componenti',
                    default: true,
                    weight: 0,
                    components: {
                      toggleCustomComp: false,
                      textfield: true,
                      textarea: true,
                      checkbox: true,
                      number: true,
                      select: true,
                      button: true,
                      radio: true,
                      selectboxes: true,
                      email: true,
                      phoneNumber: false,
                      url: true,
                      datetime: false,
                      day: true,
                      time: true,
                      currency: true,
                      hidden: true,
                      form: true,
                      calendar: true,
                      dynamic_calendar: true,
                      pagebreak: true,
                      sdcfile: {
                        title: 'File Sdc',
                        key: 'sdcfile',
                        icon: 'file',
                        schema: {
                          label: 'File',
                          type: 'sdcfile',
                          key: 'sdcfile',
                          input: true,
                          storage: "url",
                          fileMinSize: "1KB",
                          fileMaxSize: "10MB",
                          url: window.location.protocol + "//" + window.location.host + "/" + window.location.pathname.split("/")[1] + "/it/upload",
                        }
                      },
                      financial_report: true,
                      address: true,
                      survey: true
                    }
                  },
                  customLayout: {
                    title: 'Layout',
                    default: false,
                    weight: 0,
                    components: {
                      htmlelement: true,
                      columns: true,
                      pagebreak: true,
                      table: true,
                      datagrid: {
                        title: 'Datagrid',
                        key: 'Datagrid',
                        icon: 'th',
                        schema: {
                          label: 'Datagrid',
                          type: 'datagrid',
                          key: 'datagrid',
                          input: true,
                          customDefaultValue: "value = [{}]",
                        }
                      },
                      well: true,
                      panel: true,
                      editgrid: true,
                      fieldset: true
                    }
                  },
                },
              }}
              onChange={onChange}
          />
        </div>
  );
}

export default AppFormBuilder;
