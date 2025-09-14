import { STATUS_FLOW } from '../constants';

export function formatDate(d = new Date()) {
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

export function nextStatus(s) {
  const i = STATUS_FLOW.indexOf(s);
  return STATUS_FLOW[Math.min(i + 1, STATUS_FLOW.length - 1)];
}

export function progressForStatus(s) {
  return ((STATUS_FLOW.indexOf(s) + 1) / STATUS_FLOW.length) * 100;
}

