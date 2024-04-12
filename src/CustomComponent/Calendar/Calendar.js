import datepickerFactory from "jquery-datepicker";
import Base from "formiojs/components/_classes/component/Component";
import editForm from "./Calendar.form";
import moment from "moment";
//import { i18nDatepicker } from "./translations/i18n-datepicker";
import { CountDownTimer } from "./components/Countdown";

//datepickerFactory($);

export default class FormioCalendar extends Base {
  constructor(component, options, data) {
    super(component, options, data);
    this.date = false;
    this.slot = false;
    this.container = false;
    this.calendar = null;
    this.available_days = [];
    this.meeting = null;
    this.meeting_expiration_time = null;
    this.opening_hour = null;
    this.first_available_date = null;
    this.first_available_start_time = null;
    this.first_available_end_time = null;
    this.first_availability_updated_at = null;
    this.$language = document.documentElement.lang.toString();
    this.countdown = false;
    this.loaderTpl = `<div id="loader" class="text-center"><i class="fa fa-circle-o-notch fa-spin fa-lg fa-fw"></i><span class="sr-only">${Translator.trans(
      "loading",
      {},
      "messages",
      this.$language
    )}</span></div>`;
  }

  static schema() {
    return Base.schema({
      type: "calendar",
    });
  }

  static builderInfo = {
    title: "Calendar",
    group: "basic",
    icon: "calendar",
    weight: 70,
    schema: FormioCalendar.schema(),
  };

  static editForm = editForm;

  /**
   * Render returns a html string of the fully rendered component.
   *
   * @param children - If this class is extended, the sub string is passed as children.
   * @returns {string}
   */
  render(children) {
    // To make this dynamic, we could call this.renderTemplate('templatename', {}).
    let calendarClass = "";
    let content = this.renderTemplate("input", {
      input: {
        type: "input",
        ref: `${this.component.key}-selected`,
        attr: {
          id: `${this.component.key}`,
          class: "form-control",
          type: "hidden",
        },
      },
    });

    let translateLabel = this.options.i18n.resources[this.$language]

    // Calling super.render will wrap it html as a component.
    return super.render(`
    <div id="calendar-container-${this.id}" class="slot-calendar d-print-none d-preview-calendar-none">
    <div class="row"><div class="col-12 col-md-6"><h6>${translateLabel?.translation[this.component.label] || this.component.label}</h6>
    <div class="date-picker"></div></div><div class="col-12 col-md-6"><div class="row" id="slot-picker"></div></div></div></div>${content}
    <div id="date-picker-print" class="mt-3 d-print-block d-preview-calendar"></div><div class="mt-3 d-print-none d-preview-none" id="draft-expiration-container"><div id="draft-expiration" class="d-print-none d-preview-none"></div><span id="draft-expiration-countdown" class="font-weight-bolder"></span></div>`);
  }

  /**
   * After the html string has been mounted into the dom, the dom element is returned here. Use refs to find specific
   * elements to attach functionality to.
   *
   * @param element
   * @returns {Promise}
   */
  attach(element) {
    let self = this,
      calendarID = this.component.calendarId

    this.container = $(`#calendar-container-${this.id}`);

    // override default values calendar
    $.datepicker.regional[self.$language] = i18nDatepicker[self.$language];
    $.datepicker.setDefaults($.datepicker.regional[self.$language]);

    if (calendarID !== "" && calendarID != null && !this.disabled) {
      let date = moment().format("YYYY-MM-DD")
      $.ajax(self.getMonthlyAvailabilitiesUrl(date), {
        dataType: "json", // type of response data
        beforeSend: function () {
          self.container.find(".date-picker").append(self.loaderTpl);
        },
        success: function (data, status, xhr) {
          self.getFirstAvailableSlot(data);

          $("#loader").remove();
          self.calendar = self.container.find(".date-picker").datepicker({
            minDate: new Date(
              data.sort((a, b) => a.date.localeCompare(b.date))[0]
            ),
            firstDay: 1,
            dateFormat: "dd-mm-yy",
            onSelect: function (dateText) {
              if (dateText !== self.date) {
                // If date changed, reset slot choice
                self.slot = false;
                self.opening_hour = false;
                self.updateValue();
              }
              self.date = dateText;
              self.getDaySlots();

              self.renderData();
            },
            beforeShowDay: function (date) {
              const string = jQuery.datepicker.formatDate("yy-mm-dd", date);
              if(Object.keys(self.available_days).length !== 0 && Array.isArray(self.available_days)){
                if (self.available_days.some((e) => e.available === false && e.date === string)) {
                  return [
                    false,
                    "disabled",
                    Translator.trans("calendar_formio.unavailable", {}, "messages", self.$language),
                  ];
                } else {
                  return [self.available_days.some((e) => e.date === string)];
                }
              }else{
                if (data.some((e) => e.available === false && e.date === string)) {
                  return [
                    false,
                    "disabled",
                    Translator.trans("calendar_formio.unavailable", {}, "messages", self.$language),
                  ];
                } else {
                  return [data.some((e) => e.date === string)];
                }
              }
            },
            onChangeMonthYear: function (year, month, inst){
              const event = new Date(year, month - 1, 1);
              const date = moment(event).format("YYYY-MM-DD")

              $.ajax(self.getMonthlyAvailabilitiesUrl(date), {
                dataType: "json", // type of response data
                beforeSend: function () {
                  self.container.find(".date-picker").append(self.loaderTpl);
                },
                success: function (data, status, xhr) {
                  const prevFirstAvailable = self.first_available_date
                  self.getFirstAvailableSlot(data);
                  self.available_days = data

                  $("#loader").remove();
                  self.calendar = self.container.find(".date-picker").datepicker({
                    minDate: new Date(
                      data.sort((a, b) => a.date.localeCompare(b.date))[0]
                    ),
                    firstDay: 1,
                    dateFormat: "dd-mm-yy",
                  });

                  let parsedDate = null

                  if (prevFirstAvailable !== self.first_available_date) {
                    parsedDate = moment(self.first_available_date).format("DD-MM-YYYY");
                  }else{
                    parsedDate = moment(date).format("DD-MM-YYYY");
                  }
                  self.calendar.datepicker("setDate", parsedDate);
                  self.getDaySlots(parsedDate);
                },
                error: function (jqXhr, textStatus, errorMessage) {
                  // error callback
                  alert(`${Translator.trans("calendar_formio.availability_error", {}, "messages", self.$language)}`);
                },
                complete: function () {
                  //Auto-click current selected day
                  var dayActive = $("a.ui-state-active");
                  if (!self.date && dayActive.length > 0) {
                    dayActive.click();
                  }
                  self.renderData();
                },
              })}
          });

          if (self.date) {
            let parsedDate = moment(self.date, "DD-MM-YYYY");
            self.calendar.datepicker("setDate", parsedDate.toDate());
            self.getDaySlots();
          }
        },
        error: function (jqXhr, textStatus, errorMessage) {
          // error callback
          alert(`${Translator.trans("calendar_formio.availability_error", {}, "messages", self.$language)}`);
        },
        complete: function () {
          //Auto-click current selected day
          var dayActive = $("a.ui-state-active");
          if (!self.date && dayActive.length > 0) {
            dayActive.click();
          }

          self.renderData();
        },
      });
    } else {
      this.renderData()
    }
    // Allow basic component functionality to attach like field logic and tooltips.
    return super.attach(element);
  }

  /**
   * Get the value of the component from the dom elements.
   *
   * @returns {String}
   */
  getValue() {
    if (!(this.date && this.slot && this.meeting && this.opening_hour)) {
      // Unset value (needed for calendars with 'required' option"
      return null;
    }
    let meeting_id = this.meeting ? this.meeting : "";
    let opening_hour = this.opening_hour ? this.opening_hour : "";
    return `${this.date.replace(/-/g, "/")} @ ${this.slot} (${
      this.component.calendarId
    }#${meeting_id}#${opening_hour})`;
  }

  /**
   * Set the value of the component into the dom elements.
   *
   * @param value
   * @returns {boolean}
   */
  setValue(value) {
    if (!value) {
      return;
    }
    let explodedValue = value
      .replace(")", "")
      .replace(" (", " @ ")
      .replace(/\//g, "-")
      .split(" @ ");
    let explodedCalendar = explodedValue[2].split("#");
    this.date = explodedValue[0];
    this.slot = explodedValue[1];
    this.meeting = explodedCalendar[1];
    this.meeting_expiration_time = null;
    this.opening_hour =
      explodedCalendar.length === 3 ? explodedCalendar[2] : "";

    this.renderData();
  }

  renderData() {
    if (this.date) {
      let slotText = this.slot ? ` ${Translator.trans("calendar_formio.at_hours", {}, "messages", this.$language)} ${this.slot}` : "";
      $('#date-picker-print').html(
        `<b>${Translator.trans(
          "calendar_formio.day_selected",
          {},
          "messages",
          this.$language
        )}: </b> ${this.date} ${slotText}`
      );
    }
    if (this.meeting_expiration_time) {
      $("#draft-expiration").html(
        `<i>${Translator.trans(
          "calendar_formio.draft_expiration_text",
          {},
          "messages", this.$language
        )}</i>`
      );
      $("#draft-expiration-container").addClass("alert alert-info");
      if (!this.countdown) {
        this.countdown = true;
        CountDownTimer(this.meeting_expiration_time, "draft-expiration-countdown");
      }
    }
  }

  /**
   * Get first available slot from calendar
   * @param availabilities
   */
  getFirstAvailableSlot(availabilities) {
    availabilities = availabilities.sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    $(availabilities).each((i, e) => {
      if (e.available) {
        this.first_available_date = e.date;
        return false;
      }
    });
    if (this.first_available_date !== null) {
      let self = this

      $.ajax(
        self.getDailyAvailabilitiesUrl(this.first_available_date, true),
        {
          dataType: "json",
          success: function (data, status, xhr) {
            // success callback function
            let slot = data[0];
            self.first_available_start_time = slot.start_time;
            self.first_available_end_time = slot.end_time;
            self.first_availability_updated_at = moment().format();
          },
          error: function (jqXhr, textStatus, errorMessage) {
            // error callback
            console.log("Impossibile selezionare prima disponibilità");
          },
        }
      );
    }
  }

  getDaySlots(d) {
    let self = this,
      html = "",
      parsedDate = moment(d ?? self.date, "DD-MM-YYYY");

    this.container.find("#slot-picker").html(html);

    $.ajax(self.getDailyAvailabilitiesUrl(parsedDate), {
      dataType: "json", // type of response data
      beforeSend: function () {
        self.container
          .find("#slot-picker")
          .append(`<div class="col-12">${self.loaderTpl}</div>`);
      },
      success: function (data, status, xhr) {
        // success callback function
        $("#loader").remove();
        const countAllElmAvailables = data.filter(function (item) {
          return item.availability;
        }).length;

        if (countAllElmAvailables === 0) {
          self.container.find("#slot-picker")
            .html(
              `<div class="callout warning">
                 <div class="callout-title">
                   <svg class="icon"><use xlink:href="/bootstrap-italia/dist/svg/sprite.svg#it-help-circle"></use></svg>
                   ${Translator.trans("warning", {}, "messages", self.$language)}
                 </div>
                 <p>${Translator.trans("calendar_formio.no_availability_error", {}, "messages", self.$language)}</p>
               </div>`
            );
        } else {
          $(data).each(function (index, element) {
            let cssClass = "available";
            let ariaDisabled = false;
            if (!element.availability) {
              cssClass = "disabled";
              ariaDisabled = true;
            }

            let key = `${element.start_time}-${element.end_time}`;
            if (key === self.slot) {
              cssClass = `${cssClass} active`;
            }
            let op_hour = element.opening_hour;
            html = html.concat(
              `<div class="col-6"><button type="button" data-slot="${key}" data-opening_hour="${op_hour}" class="btn btn-ora p-0 ${cssClass}" ${
                ariaDisabled ? 'tabindex="-1"' : ""
              } aria-disabled="${ariaDisabled}">${key}</button></div>`
            );
          });
          self.container
            .find("#slot-picker")
            .html(
              `<div class="col-12">
                 <h6>${Translator.trans("calendar_formio.availability_hours", {}, "messages", self.$language)} ${self.date}</h6>
               </div>${html}`
            );

          $(".btn-ora.available").on("click", function (e) {
            e.preventDefault();
            $(".btn-ora.active").removeClass("active");
            $(this).addClass("active");
            self.slot = $(this).data("slot");
            self.opening_hour = $(this).data("opening_hour");

            self.createOrUpdateMeeting();
            self.updateValue();

            $("#date-picker-print").addClass("d-preview-calendar-none");
          });
        }
      },
      error: function (jqXhr, textStatus, errorMessage) {
        // error callback
        alert(`${Translator.trans("calendar_formio.availability_error", {}, "messages", self.$language)}`
        );
      },
      complete: function () {
        //Click available hour button only is visible for auto selection
        const btnHourActive = $(".btn-ora.available.active");
        if (btnHourActive.length > 0 && btnHourActive.is(":visible")) {
          btnHourActive.click();
        }
      },
    });
  }

  createOrUpdateMeeting() {
    let self = this,
      location = window.location,
      explodedPath = location.pathname.split("/");

    $.ajax(
      `${location.origin}/${explodedPath[1]}/${explodedPath[2]}/meetings/new-draft`,
      {
        method: "POST",
        data: {
          date: self.date,
          slot: self.slot,
          calendar: this.component.calendarId,
          opening_hour: self.opening_hour,
          meeting: self.meeting,
          first_available_date: self.first_available_date,
          first_available_start_time: self.first_available_start_time,
          first_available_end_time: self.first_available_end_time,
          first_availability_updated_at: self.first_availability_updated_at,
        },
        dataType: "json", // type of response data
        success: function (data, status, xhr) {
          // success callback function
          if (data.hasOwnProperty('id')) {
            self.meeting = data.id;
            self.meeting_expiration_time = moment(data.expiration_time, "YYYY-MM-DD h:mm");
            self.updateValue();
          }
        },
        error: function (jqXhr, textStatus, errorMessage) {
          // error callback
          alert(`${Translator.trans("calendar_formio.availability_error", {}, "messages", self.$language)}`);
          // Reinitialize
          self.slot = null;
          self.meeting = null;
          self.meeting_expiration_time = null;
          self.updateValue();
          self.getDaySlots();
        },
        complete: function () {
          if (self.date && self.slot && self.meeting && self.opening_hour) {
            self.renderData();
          } else {
            $("#draft-expiration-container").addClass("alert alert-warning");
            $("#draft-expiration-container").html(`<i>${Translator.trans("calendar_formio.draft_creation_error", {}, "messages", self.$language)}</i>`)
          }
        },
      }
    );
  }

  getMonthlyAvailabilitiesUrl(date, available=false) {
    let self = this,
      calendarID = this.component.calendarId,
      selectOpeningHours = this.component.select_opening_hours,
      openingHours = this.component.select_opening_hours
        ? this.component.opening_hours
        : [],
      location = window.location,
      explodedPath = location.pathname.split("/");

    let url = `${location.origin}/${explodedPath[1]}/api/calendars/${calendarID}/availabilities`;

    let queryParameters = [
      `from_time=${moment(date).startOf('month').format("YYYY-MM-DD")}`,
      `to_time=${moment(date).endOf("month").format("YYYY-MM-DD")}`,
    ];
    if (available) {
      queryParameters.push(`available=${available}`);
    }
    // filter availabilities by selected opening-hours (this is mandatory in case of overlapped opening hours)
    if (selectOpeningHours && openingHours) {
      // Select specific opening hours
      queryParameters.push(`opening_hours=${openingHours.join()}`);
    }

    return `${url}?${queryParameters.join("&")}`;
  }

  getDailyAvailabilitiesUrl(date, available=false) {
    let self = this,
      calendarID = this.component.calendarId,
      selectOpeningHours = this.component.select_opening_hours,
      openingHours = this.component.select_opening_hours
        ? this.component.opening_hours
        : [],
      location = window.location,
      explodedPath = location.pathname.split("/");

    date = moment(date).format("YYYY-MM-DD");
    let url = `${location.origin}/${explodedPath[1]}/api/calendars/${calendarID}/availabilities/${date}`;

    let queryParameters = [];
    if (available) {
      queryParameters.push(`available=${available}`);
    }
    if (self.meeting) {
      // Exclude saved meeting from unavailabilities
      queryParameters.push(`exclude=${self.meeting}`);
    }
    if (selectOpeningHours && openingHours) {
      // Select specific opening hours
      queryParameters.push(`opening_hours=${openingHours.join()}`);
    }

    if (queryParameters) {
      url = `${url}?${queryParameters.join("&")}`;
    }

    return url;
  }
}
