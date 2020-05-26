import moment from 'moment';

const getFormattedDateTime = (date: any) => {
  var publishedAt = date;

  if (date !== ' ' && date !== undefined) {
    if (date.includes(' ')) {
      publishedAt = date.replace(' ', 'T') + '+00:00';
    }
    var today = moment(new Date());
    var formated_date = new Date(getLocalDate(publishedAt)).toString();
    var published = moment(new Date(getLocalDate(publishedAt)));

    var seconds = today.diff(published, 'seconds');
    var minutes = today.diff(published, 'minutes');
    var hours = today.diff(published, 'hours');
    var days = today.diff(published, 'days');

    if (seconds < 60) {
      return 'Just now';
    } else if (seconds >= 60 && minutes < 60) {
      return minutes + (minutes === 1 ? ' min ' : ' mins ') + 'ago';
    } else if (minutes >= 60 && hours < 24) {
      return hours + (hours === 1 ? ' hour ' : ' hours ') + 'ago';
    } else if (hours >= 24 && hours < 48) {
      return days + (days === 1 ? ' day ' : ' days ') + 'ago';
    } else if (hours >= 48) {
      return formated_date.slice(4, 10) + ', ' + formated_date.slice(10, 15);
    }
  } else {
    return null;
  }
};

const getHoursDifference = (date: any) => {
  var currentTime = moment(new Date(Date.now()));
  var previousTime = moment(new Date(parseInt(date)));

  var hours = currentTime.diff(previousTime, 'hours');

  return hours;
};

const getLocalDate = (dateTime) => {
  var dt = new Date(dateTime);
  var minutes = dt.getTimezoneOffset();
  dt = new Date(dt.getTime() + minutes * 60000);
  return dt;
};

const getFormattedPublishedDate = (publishedAt: any, format: any) => {
  return moment(publishedAt).format(format);
};

const getPreviousMonth = (currentMonth: any, format: any) => {
  return moment(currentMonth, 'MMMM YYYY').subtract(1, 'months').format(format);
};

const getCurrentMonth = (format: any) => {
  return moment(new Date()).format(format);
};

const getNextMonth = (currentMonth: any, format: any) => {
  return moment(currentMonth, 'MMMM YYYY').add(1, 'months').format(format);
};

const getFormatedMonth = (currentMonth: any) => {
  return moment(currentMonth, 'MMMM YYYY').format('DD/MM/YYYY');
};

const getIssuedDate = (publishedAt: any) => {
  return moment(publishedAt).format('MMM DD');
};

const getDays = (publishedAt: any) => {
  var today = moment(new Date());
  var published = moment(new Date(publishedAt));
  var days = today.diff(published, 'days');
  if (days >= 30) {
    return true;
  } else {
    return false;
  }
};
const getCurrentTodayDate = () => {
  const today = moment();
  return today.format('YYYY-MM-DD');
};

const getDaysDifference = (date: any) => {
  var today = moment(new Date());
  var oldDate = moment(new Date(date));
  var days = today.diff(oldDate, 'days');

  return days;
};
export {
  getFormattedDateTime,
  getHoursDifference,
  getFormattedPublishedDate,
  getPreviousMonth,
  getNextMonth,
  getFormatedMonth,
  getCurrentMonth,
  getIssuedDate,
  getDays,
  getCurrentTodayDate,
  getDaysDifference,
};
