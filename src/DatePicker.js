import {useState} from "react";
import DatePicker, {registerLocale} from "react-datepicker";
import { de } from 'date-fns/locale/de';
import { enGB } from 'date-fns/locale/en-GB';
import { it } from 'date-fns/locale/it';
import "react-datepicker/dist/react-datepicker.css";

registerLocale('de', de)


function DatePickerInput({url}) {
  const [startDate, setStartDate] = useState(new Date());

  return (
      <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} locale="de" dateFormat={'L'}/>
  );
}

export default DatePickerInput;
