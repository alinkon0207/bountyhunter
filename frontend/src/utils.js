import moment from 'moment';
import { keyframes } from '@emotion/react';
import { useMediaQuery } from 'react-responsive';
import { BountyStatus, WorkStatus } from './contexts/ContractContext';

export const SECS_PER_MIN = 60;
export const MINS_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;
export const DAYS_PER_MONTH = 30;
export const MONTHS_PER_YEAR = 12;
export const SECS_PER_HOUR = MINS_PER_HOUR * SECS_PER_MIN;
export const SECS_PER_DAY = HOURS_PER_DAY * SECS_PER_HOUR;

export const fadeInUp = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(40px);
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`;

export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
}

export function IsSmMobile() {
  return useMediaQuery({ maxWidth: '639px' });
}

export function IsMobile() {
  return useMediaQuery({ maxWidth: '767px' });
}

export function IsMdScreen() {
  return useMediaQuery({ maxWidth: '1199px' });
}

function currentYPosition() {
  if (!window) {
    return;
  }
  // Firefox, Chrome, Opera, Safari
  if (window.pageYOffset) return window.pageYOffset;
  // Internet Explorer 6 - standards mode
  if (document.documentElement && document.documentElement.scrollTop)
    return document.documentElement.scrollTop;
  // Internet Explorer 6, 7 and 8
  if (document.body.scrollTop) return document.body.scrollTop;
  return 0;
}

function elmYPosition(elm) {
  var y = elm.offsetTop;
  var node = elm;
  while (node.offsetParent && node.offsetParent !== document.body) {
    node = node.offsetParent;
    y += node.offsetTop;
  }
  return y;
}

export function scrollTo(scrollableElement, elmID) {
  var elm = document.getElementById(elmID);
  if (!elmID || !elm) {
    return;
  }
  var startY = currentYPosition();
  var stopY = elmYPosition(elm);
  var distance = stopY > startY ? stopY - startY : startY - stopY;
  if (distance < 100) {
    scrollTo(0, stopY);
    return;
  }
  var speed = Math.round(distance / 50);
  if (speed >= 20) speed = 20;
  var step = Math.round(distance / 25);
  var leapY = stopY > startY ? startY + step : startY - step;
  var timer = 0;
  if (stopY > startY) {
    for (var i = startY; i < stopY; i += step) {
      setTimeout(
        (function (leapY) {
          return () => {
            scrollableElement.scrollTo(0, leapY);
          };
        })(leapY),
        timer * speed
      );
      leapY += step;
      if (leapY > stopY) leapY = stopY;
      timer++;
    }
    return;
  }
  for (let i = startY; i > stopY; i -= step) {
    setTimeout(
      (function (leapY) {
        return () => {
          scrollableElement.scrollTo(0, leapY);
        };
      })(leapY),
      timer * speed
    );
    leapY -= step;
    if (leapY < stopY) leapY = stopY;
    timer++;
  }
  return false;
}

export function getTimeDifference(date) {
  let difference =
    moment(new Date(), 'YYYY-MM-DD HH:mm:ss').diff(
      moment(new Date(date), 'YYYY-MM-DD HH:mm:ss')
    ) / 1000;

  if (difference < SECS_PER_MIN) return `${Math.floor(difference)} seconds`;
  else if (difference < SECS_PER_HOUR) return `${Math.floor(difference / SECS_PER_MIN)} minutes`;
  else if (difference < SECS_PER_DAY) return `${Math.floor(difference / SECS_PER_HOUR)} hours`;
  else if (difference < SECS_PER_DAY * DAYS_PER_MONTH)
    return `${Math.floor(difference / SECS_PER_DAY)} days`;
  else if (difference < SECS_PER_DAY * DAYS_PER_MONTH * MONTHS_PER_YEAR)
    return `${Math.floor(difference / SECS_PER_DAY / DAYS_PER_MONTH)} months`;
  else return `${(difference / SECS_PER_DAY / DAYS_PER_MONTH / MONTHS_PER_YEAR).toFixed(1)} years`;
}

export function getUTCNow() {
  return Date.now();
}

export function getUTCTimestamp(_date) {
  var date = new Date(_date);
  var date_utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 
    date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())
  return date_utc.getTime();
}

export function getUTCDate(timestamp) {
  const num_time = parseInt(timestamp) * 1000;
  const date = new Date(num_time);
  return moment.utc(date).format('MMMM Do, HH:mm UTC');
}

export function getDeadlineTimestamp(start_time, duration) {
  const utc_date = new Date(parseInt(start_time));
  const start_utc = Date.UTC(utc_date.getUTCFullYear(), utc_date.getUTCMonth(), utc_date.getUTCDate(), 
    utc_date.getUTCHours(), utc_date.getUTCMinutes(), utc_date.getUTCSeconds());
  if (duration > 3650)
    duration = 3650;
  return start_utc + duration * SECS_PER_DAY * 1000;
}

export function getTime(date) {
  return (date * SECS_PER_DAY * 1000).toString();
}

export function getDate(timestamp) {
  const num_time = parseInt(timestamp) * 1000;
  const date = new Date(num_time);
  return moment(date).format('YYYY/MM/DD');
}

export function getStringDate(timestamp) {
  const num_time = parseInt(timestamp) * 1000;
  const date = new Date(num_time);
  return moment(date).format('DD MMM');
}

export function validationStartTime(start_time) {
  const start_date = new Date(parseInt(start_time * 1000));
  const now_date = new Date();
  let difference =
    moment(start_date, 'DD/MM/YYYY HH:mm:ss').diff(
      moment(now_date, 'DD/MM/YYYY HH:mm:ss')
    ) / 1000;
  if (difference > -SECS_PER_DAY)
    return true;
  else
    return false;
}

export function generateRandomId() {
  let tempId = Math.random().toString();
  let uid = tempId.substr(2, tempId.length - 1);
  return uid;
}

export function getQueryParam(prop) {
  var params = {};
  var search = decodeURIComponent(
    window.location.href.slice(window.location.href.indexOf('?') + 1)
  );
  var definitions = search.split('&');
  definitions.forEach(function (val, key) {
    var parts = val.split('=', 2);
    params[parts[0]] = parts[1];
  });
  return prop && prop in params ? params[prop] : params;
}

export function classList(classes) {
  return Object.entries(classes)
    .filter(entry => entry[1])
    .map(entry => entry[0])
    .join(' ');
}

export const parseErrorMsg = (errMsg) => {
  var returStr = '';
  let startPos = JSON.stringify(errMsg).search('message');
  if (startPos >= 0) {
    let subStr = errMsg.substring(startPos + 4, errMsg.length)
    let endPos = subStr.indexOf('\'');
    if (endPos >= 0) {
      subStr = subStr.substring(0, endPos);
      returStr = subStr;
    }
  } else returStr = errMsg;
  return returStr;
}

export const numberWithCommas = (x, digit = 3) => {
  if (isEmpty(x) || isNaN(x)) return '0';
  return Number(x).toLocaleString(undefined, { maximumFractionDigits: digit });
}

export const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0);

/* Added on 2023/09/13 */
export const shortenAddress = (addr) => {
  return addr?.slice(0, 4) + '...' + addr?.slice(-4);
}

export function getDuration(duration) {
  switch (duration) {
    case 1: // More than 6 months
      return 365
    case 2: // 3~6 months
      return 183
    case 3: // 1~3 months
      return 92
    case 4: // Less than 1 month
      return 31
    default:
      return 0
  }
}

export function getType(type) {
  switch (type) {
    case 1:
      return 'Competitive'
    case 2:
      return 'Cooperative'
    case 3:
      return 'Hakathon'
    default:
      return 'Unknown type'
  }
}

export function getLevel(difficulty) {
  switch (difficulty) {
    case 1:
      return 'Beginner'
    case 2:
      return 'Intermediate'
    case 3:
      return 'Advanced'
    default:
      return 'Unknown level'
  }
}

export function getTopic(topic) {
  switch (topic) {
    case 1:
      return 'Design'
    case 2:
      return 'Development'
    case 3:
      return 'Smart Contracts'
    case 4:
      return 'Data'
    case 5:
      return 'AI'
    default:
      return 'Unknown topic'
  }
}

export function getBountyStatus(status) {
  switch (status) {
    case BountyStatus.INIT:
      return 'INIT'
    case BountyStatus.ACTIVE:
      return 'ACTIVE'
    case BountyStatus.CANCELLED:
      return 'CANCELLED'
    case BountyStatus.COMPLETE:
      return 'COMPLETE'
    case BountyStatus.CLOSED:
      return 'CLOSED'
    default:
      return 'Unknown status'
  }
}

export function getWorkStatus(status) {
  switch (status) {
    case WorkStatus.INIT:
      return 'INIT'
    case WorkStatus.APPLIED:
      return 'APPLIED'
    case WorkStatus.SUBMITTED:
      return 'SUBMITTED'
    case WorkStatus.APPROVED:
      return 'APPROVED'
    case WorkStatus.REJECTED:
      return 'REJECTED'
    default:
      return 'Unknown status'
  }
}

export function convertUTCDateToLocalDate(date) {
  var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

  var offset = date.getTimezoneOffset() / MINS_PER_HOUR;
  var hours = date.getHours();

  newDate.setHours(hours - offset);

  return newDate;   
}

export function getFormatedDate(timestamp) {
  const num_time = parseInt(timestamp);
  const date = new Date(num_time);
  return moment(date).format('MMMM DD, YYYY, hh:mm A')
}
