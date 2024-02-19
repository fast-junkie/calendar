(() => {
  function Storage(_isLocal) {
    this.storage = (!_isLocal) ? window.sessionStorage : window.localStorage;
  }
  Storage.prototype = {
    get(_k) {
      const _item = this.storage.getItem(_k);
      return (_item) ? JSON.parse(_item) : _item;
    },
    set(_k, _v) {
      this.storage.setItem(_k, JSON.stringify(_v));
    },
    remove(_k) {
      this.storage.removeItem(_k);
    },
  };

  function Util() {}
  Util.prototype = {
    createElement({
      type, id, attrs, events, markup,
    }) {
      const _attrs = Object.assign(attrs || {}, { id });
      const _events = Object.assign(events || {});
      const _element = document.createElement(type);
      Object
        .keys(_attrs)
        .forEach((_attr) => {
          if (_attrs[_attr] !== undefined) {
            _element.setAttribute(_attr, _attrs[_attr]);
          }
        });
      Object
        .keys(_events)
        .forEach((_event) => {
          if (typeof _events[_event] === 'function') {
            _element.addEventListener(_event, _events[_event]);
          }
        });
      _element.innerHTML = markup || null;
      return _element;
    },
    leadingZeros(_i) {
      return (_i < 10) ? `0${_i}` : `${_i}`;
    },
  };

  function Calendar() {
    this.date = luxon.DateTime;
    this.storage = new Storage(true);
    this.util = new Util();
    this.modal = new bootstrap.Modal('#modal-event');
    this.dom = {
      calendar: document.querySelector('#calendar'),
      controls: {
        back: document.querySelector('#back'),
        month: document.querySelector('#month'),
        next: document.querySelector('#next'),
        year: document.querySelector('#year'),
      },
      form: document.querySelector('form'),
      modal: {
        date: document.querySelector('#date'),
        delete: document.querySelector('#delete'),
        event: document.querySelector('#event'),
        save: document.querySelector('#save'),
      },
    };
    this.months = [
      { short: 'Jan', long: 'January' },
      { short: 'Feb', long: 'February' },
      { short: 'Mar', long: 'March' },
      { short: 'Apr', long: 'April' },
      { short: 'May', long: 'May' },
      { short: 'Jun', long: 'June' },
      { short: 'Jul', long: 'July' },
      { short: 'Aug', long: 'August' },
      { short: 'Sep', long: 'September' },
      { short: 'Oct', long: 'October' },
      { short: 'Nov', long: 'November' },
      { short: 'Dec', long: 'December' },
    ];
    this.days = [
      { short: 'Sun', long: 'Sunday' },
      { short: 'Mon', long: 'Monday' },
      { short: 'Tue', long: 'Tueday' },
      { short: 'Wed', long: 'Wednesday' },
      { short: 'Thu', long: 'Thurday' },
      { short: 'Fri', long: 'Friday' },
      { short: 'Sat', long: 'Saturday' },
    ];
    this.matrix = [];
    this.event = {};
    this.selectedDay = this.date.now().day;
    this.selectedMonth = this.date.now().month;
    this.selectedYear = this.date.now().year;
  }
  Calendar.prototype = {
    setCalendar() {
      const _daysInMonth = this.date.local(this.selectedYear, this.selectedMonth).daysInMonth;
      const _dayFirst = this.date.local(this.selectedYear, this.selectedMonth, 1).weekday;
      const _dayLast = this.date.local(this.selectedYear, this.selectedMonth, _daysInMonth).weekday;
      this.matrix = [];
      if (_dayFirst !== 7) {
        for (let _i = 0; _i < _dayFirst; _i += 1) {
          this.matrix.push(0);
        }
      }
      for (let i = 1; i <= _daysInMonth; i += 1) {
        this.matrix.push(i);
      }
      if (_dayLast !== 6) {
        const _empty = (_dayLast === 7) ? 6 : 6 - _dayLast;
        for (let i = 0; i < _empty; i += 1) {
          this.matrix.push(0);
        }
      }
    },
    setControlEvent() {
      if (this.dom.form && this.dom.modal.save && this.dom.modal.delete) {
        this.dom.form.addEventListener('submit', (_v) => { _v.preventDefault(); });
        this.dom.modal.save.addEventListener('click', this.save.bind(this));
        this.dom.modal.delete.addEventListener('click', this.delete.bind(this));
      }
    },
    setControlAugment() {
      if (this.dom.controls.back && this.dom.controls.next) {
        this.dom.controls.back.addEventListener('click', this.shift.bind(this));
        this.dom.controls.next.addEventListener('click', this.shift.bind(this, true));
      }
    },
    setControlMonth() {
      if (this.dom.controls.month) {
        this.months
          .forEach((_v, _i) => {
            const _month = (_i + 1);
            const _opts = {
              type: 'option',
              attrs: { value: _month },
              markup: _v.long,
            };
            if (this.date.now().month === _month) {
              _opts.attrs.selected = true;
            }
            const _option = this.util.createElement(_opts);
            this.dom.controls.month.insertAdjacentElement('beforeend', _option);
          });
        this.dom.controls.month.addEventListener('change', this.render.bind(this));
      }
    },
    setControlYear() {
      if (this.dom.controls.year) {
        this.dom.controls.year.value = this.date.now().year;
        this.dom.controls.year.addEventListener('change', this.render.bind(this));
      }
    },
    setSelected() {
      if (this.dom.controls.month && this.dom.controls.year) {
        this.selectedMonth = parseInt(this.dom.controls.month.value, 10);
        this.selectedYear = parseInt(this.dom.controls.year.value, 10);
      }
    },
    setEventData() {
      const _key = `${this.selectedYear}.${this.selectedMonth}`;
      this.event = this.storage.get(_key) || {};
    },
    today() {
      return ((this.selectedMonth === this.date.now().month) && (this.selectedYear === this.date.now().year))
        ? this.date.now().day
        : null;
    },
    buildCalendar() {
      this.dom.calendar.replaceChildren();
      const _calendarBody = this.util.createElement({
        type: 'div',
        attrs: { class: 'calendar-body border-start border-bottom mb-3' },
      });
      let _calendarWeek = this.util.createElement({
        type: 'div',
        attrs: { class: 'calendar-week d-flex' },
      });
      _calendarBody.insertAdjacentElement('beforeend', _calendarWeek);

      const _calendarHead = this.util.createElement({
        type: 'div',
        attrs: { class: 'calendar-head d-flex border border-bottom-0' },
      });
      this.dom.calendar.insertAdjacentElement('beforeend', _calendarHead);
      this.dom.calendar.insertAdjacentElement('beforeend', _calendarBody);

      this.days
        .forEach((_v) => {
          const _div = this.util.createElement({
            type: 'div',
            attrs: {
              class: 'bg-secondary-subtle text-center py-3',
              style: 'width:14.2857%;',
              title: _v.long,
            },
            markup: _v.short,
          });
          _calendarHead.insertAdjacentElement('beforeend', _div);
        });

      this.matrix
        .forEach((_v, _i) => {
          const _isRowEnd = ((_i + 1) % 7) === 0;
          const _opts = {
            type: 'div',
            attrs: {
              class: 'border-top border-end pt-1 px-2',
              style: 'min-height:80px;width:14.2857%;',
            },
          };
          if (_v === this.today()) {
            _opts.attrs.class += ' bg-warning-subtle';
          }
          if (_v === 0) {
            _opts.attrs.class += ' bg-dark-subtle';
          } else {
            _opts.attrs.style += ' cursor:pointer;';
            _opts.markup = `<div class="date text-end">${_v}</div>`;
            if (this.event[_v]) {
              _opts.markup += `<div class="event small text-truncate">${this.event[_v]}</div>`;
            }
            _opts.events = {
              click: this.show.bind(this, _v),
            };
          }

          const _date = this.util.createElement(_opts);
          _calendarWeek.insertAdjacentElement('beforeend', _date);
          if (_isRowEnd) {
            _calendarWeek = this.util.createElement({ type: 'div', attrs: { class: 'calendar-week d-flex' } });
            _calendarBody.insertAdjacentElement('beforeend', _calendarWeek);
          }
        });
    },
    delete() {
      if (this.dom.modal.event.value.length && window.confirm('Are you sure...?')) {
        const _key = `${this.selectedYear}.${this.selectedMonth}`;
        delete this.event[this.selectedDay];
        this.storage.set(_key, this.event);
        this.modal.hide();
      }
      this.render();
    },
    save() {
      if (this.dom.modal.event.value.length) {
        const _key = `${this.selectedYear}.${this.selectedMonth}`;
        this.event[this.selectedDay] = this.dom.modal.event.value;
        this.storage.set(_key, this.event);
        this.modal.hide();
      }
      this.render();
    },
    shift(...args) {
      const [_advance] = args;
      this.selectedMonth = parseInt(this.dom.controls.month.value, 10);
      this.selectedYear = parseInt(this.dom.controls.year.value, 10);
      if (typeof _advance === 'boolean') {
        this.selectedMonth += 1;
      } else {
        this.selectedMonth -= 1;
      }
      if (this.selectedMonth > 12) {
        this.selectedMonth = 1;
        this.selectedYear += 1;
      }
      if (this.selectedMonth < 1) {
        this.selectedMonth = 12;
        this.selectedYear -= 1;
      }
      this.dom.controls.month.value = this.selectedMonth;
      this.dom.controls.year.value = this.selectedYear;
      this.render();
    },
    show(...args) {
      const [_date] = args;
      this.selectedDay = _date;
      this.dom.form.reset();

      const _modalDate = [
        this.util.leadingZeros(this.selectedDay),
        this.months[this.selectedMonth - 1].short,
        this.selectedYear.toString().slice(2),
      ];
      this.dom.modal.date.value = _modalDate.join('-');

      const _event = this.event[this.selectedDay];
      if (_event) {
        this.dom.modal.event.value = _event;
        this.dom.modal.delete.classList.remove('d-none');
      } else {
        this.dom.modal.delete.classList.add('d-none');
      }

      this.modal.show();
    },
    render() {
      this.setSelected();
      this.setCalendar();
      this.setEventData();
      this.buildCalendar();
    },
    init() {
      this.setControlAugment();
      this.setControlEvent();
      this.setControlMonth();
      this.setControlYear();
      this.render();
    },
  };

  function Holidays() {
    this.storage = new Storage(true);
    this.isSet = false;
    this.public = [
      { key: '2024.1', value: { 1: '🎉 New Year\'s Day', 15: 'Martin Luther King Jr. Day' } },
      { key: '2024.2', value: { 19: 'Presidents\' Day' } },
      { key: '2024.5', value: { 27: '🇺🇸 Memorial Day' } },
      { key: '2024.6', value: { 19: 'Juneteenth' } },
      { key: '2024.7', value: { 4: '🎆 Independence Day' } },
      { key: '2024.9', value: { 2: '⚒️ Labor Day' } },
      { key: '2024.10', value: { 14: 'Columbus Day' } },
      { key: '2024.11', value: { 11: '🎖️ Veterans Day', 28: '🦃 Thanksgiving Day' } },
      { key: '2024.12', value: { 25: '🎄 Christmas Day' } },
      { key: '2025.1', value: { 1: '🎉 New Year\'s Day', 20: 'Martin Luther King Jr. Day' } },
      { key: '2025.2', value: { 17: 'Presidents\' Day' } },
      { key: '2025.5', value: { 26: '🇺🇸 Memorial Day' } },
      { key: '2025.6', value: { 19: 'Juneteenth' } },
      { key: '2025.7', value: { 4: '🎆 Independence Day' } },
      { key: '2025.9', value: { 1: '⚒️ Labor Day' } },
      { key: '2025.10', value: { 13: 'Columbus Day' } },
      { key: '2025.11', value: { 11: '🎖️ Veterans Day', 27: '🦃 Thanksgiving Day' } },
      { key: '2025.12', value: { 25: '🎄 Christmas Day' } },
    ];
  }
  Holidays.prototype = {
    setPublic() {
      this.public
        .forEach((_v) => {
          this.storage.set(_v.key, _v.value);
        });
      this.storage.set('public-set', true);
    },
    status() {
      return this.storage.get('public-set') || false;
    },
    init() {
      if (!this.status()) {
        this.setPublic();
      }
    },
  };

  const _interval = setInterval(() => {
    if (document.readyState === 'complete') {
      try {
        (new Holidays()).init();
        (new Calendar()).init();
      } catch (_e) {
        console.debug('app.min.js > _interval\n%o', _e);
      }
      clearInterval(_interval);
    }
  }, 6e2);
})();
