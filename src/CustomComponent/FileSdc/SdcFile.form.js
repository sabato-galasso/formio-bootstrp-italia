import {Components} from "@formio/react";
import FileEditData from './SdcFile.edit.data';
import FileEditDisplay from './SdcFile.edit.display';
import FileEditFile from './SdcFile.edit.file';
import FileEditValidation from './SdcFile.edit.validation';

export default function(...extend) {
  return Components.baseEditForm([
    {
      key: 'display',
      components: FileEditDisplay
    },
    {
      key: 'data',
      components: FileEditData
    },
    {
      label: 'File',
      key: 'file',
      weight: 5,
      components: FileEditFile
    },
    {
      key: 'validation',
      components: FileEditValidation
    },
  ], ...extend);
}
