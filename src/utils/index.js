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

// Self-tests (non-UI)
export function _assert(cond, msg) { 
  if (!cond) throw new Error(msg); 
}

export function runSelfTests() {
  try {
    _assert(Array.isArray(STATUS_FLOW) && STATUS_FLOW[0] === "Pending", "STATUS_FLOW start");
    _assert(STATUS_FLOW.at(-1) === "Completed", "STATUS_FLOW end");
    _assert(STATUS_FLOW.length === 6, "STATUS_FLOW has 6 states");
    _assert(nextStatus("Pending") === "Under Review", "nextStatus forward");
    _assert(nextStatus("Completed") === "Completed", "nextStatus clamp");
    _assert(Math.round(progressForStatus("Matched")) === Math.round((3/6)*100), "progress calc");
    _assert(progressForStatus("Completed") === 100, "Completed is 100% progress");
    const fd = formatDate(); 
    _assert(typeof fd === "string" && fd.length > 0, "formatDate string");
    console.log("[NamaaPrototype] Self-tests passed ✅");
  } catch (e) {
    console.error("[NamaaPrototype] Self-tests failed:", e);
  }
}
