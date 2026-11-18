;(() => {
  const factory = (require) => {
    const module = { exports: {} }
    var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.jsx
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);
var import_react = require("react");
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");

// src/copy.js
var en = {
  title: "Run Receipt",
  runs: "Runs",
  plans: "Plans",
  refresh: "Refresh",
  loading: "Loading\u2026",
  all: "All runs",
  unread: "Unread",
  read: "Read",
  next: "Next",
  previous: "Previous",
  noRuns: "No runs to show.",
  choosePlan: "Choose a native schedule in Plans to start tracking.",
  noUnread: "You\u2019re caught up.",
  noPlans: "Create a schedule in DSH Tasks, then refresh this list.",
  chooseRun: "Choose a run to see its evidence.",
  close: "Close",
  change: "Edit rule",
  stop: "Stop tracking",
  track: "Track this plan",
  save: "Save rule",
  cancel: "Cancel",
  workspace: "Workspace",
  path: "Report path",
  headingInput: "Required Markdown headings, one per line",
  example: "reports/{date}.md",
  preview: "Expected path",
  ruleHelp: "{date} uses the plan\u2019s time zone. Leave the path empty to track execution only.",
  supported: "New session every run",
  session: "Existing session \xB7 delivery only",
  new_once: "New session once \xB7 delivery only",
  active: "Active",
  paused: "Paused",
  ended: "Ended",
  tracked: "Tracking",
  delivery: "Delivery",
  execution: "Execution",
  artifact: "Report",
  timeZone: "Time zone",
  scheduled: "Scheduled time",
  deliveredAt: "Delivered at",
  endedAt: "Turn ended at",
  delivered: "Delivered",
  waiting: "Awaiting receipt",
  missed: "No receipt observed",
  pending: "Awaiting turn",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
  passed: "Passed",
  rejected: "Needs attention",
  unknown: "Evidence incomplete",
  noRule: "Execution only",
  notChecked: "Not checked",
  openSession: "Open session",
  openFile: "Open current file",
  revealFile: "Reveal file",
  checkCurrent: "Check current version",
  sessionId: "Session",
  messageId: "Message",
  turn: "Turn",
  eventSeq: "Event sequence",
  reason: "Outcome",
  version: "Version at review",
  beforeVersion: "Pre-run version",
  writeVersion: "Version written by the turn",
  writeEvent: "Write result event",
  reviewedAt: "Reviewed at",
  currentVersion: "Current version",
  currentChanged: "The file changed after review.",
  sameVersion: "Matches the reviewed version.",
  currentMissing: "The file is currently missing.",
  headingRules: "Markdown headings",
  rulePass: "Present",
  ruleFail: "Missing",
  unavailableHeading: "Unchecked",
  noReceiptBoundary: "DSH showed this occurrence as due throughout the observation window. No matching receipt was found when last checked.",
  waitingBoundary: "DSH reported this upcoming occurrence. A receipt will appear after delivery is recorded.",
  observedFrom: "Observed from",
  observedThrough: "Observed through",
  readAction: "Mark as read",
  unreadAction: "Mark unread",
  emptyAction: "Confirm no report expected",
  emptyConfirm: "No report expected \xB7 confirmed by you",
  manual: "Your review",
  stale: "The version matches the pre-run file. This run did not produce a verified update.",
  missing: "The expected file was missing at review.",
  verified: "The file version matches a successful write in this turn.",
  headingsMissing: "The turn wrote this version. Required headings are missing.",
  unattributedChange: "The file changed since the pre-run observation. The current version could not be attributed to this turn.",
  unattributed: "The file exists. The current version could not be attributed to this turn.",
  changedAfterWrite: "The file version differs from the last verified write by this turn.",
  scopeChanged: "The saved rule or workspace changed before the report could be checked.",
  outsideWorkspace: "Choose a relative path inside the scheduled workspace.",
  notFile: "The path is not a regular file.",
  fileUnavailable: "The file could not be read. Open its session to inspect it.",
  unstable: "The file changed while it was being read.",
  tooLarge: "Report exceeds the 256 KiB heading inspection limit.",
  notText: "The report is not UTF-8 text.",
  noAcceptance: "DSH has no matching turn input in the available session log.",
  noTerminal: "DSH has no recorded end for the matched turn.",
  ambiguous: "The receipt could not be linked to one fresh-session turn.",
  sessionUnavailable: "The session log could not be read.",
  modeUnsupported: "Shared-session execution is unavailable.",
  catalogUnavailable: "DSH plans could not be read. Refresh to reconnect.",
  historyUnavailable: "Some DSH histories could not be read completely. Refresh to try again.",
  storageUnavailable: "The profile ledger could not be opened. Check its permissions and restart DSH.",
  unavailable: "Run Receipt could not complete the request. Refresh and try again.",
  invalidPlan: "This plan no longer supports tracking. Refresh the plan list.",
  invalidRule: "Use a workspace-relative path and up to 12 headings for a Markdown report.",
  invalidRun: "This run is no longer available. Refresh the list.",
  denied: "This profile requires DSH owner access. Reopen it from DSH.",
  openFailed: "DSH could not open this item. Use its session or workspace to locate it.",
  compatibilityChanged: "Review the rule after a workspace or time-zone change."
};
var zh = {
  title: "\u5B9A\u65F6\u4EFB\u52A1\u9A8C\u6536\u7BB1",
  runs: "\u8FD0\u884C\u8BB0\u5F55",
  plans: "\u8BA2\u9605\u8BA1\u5212",
  refresh: "\u5237\u65B0",
  loading: "\u6B63\u5728\u52A0\u8F7D\u2026",
  all: "\u5168\u90E8\u8FD0\u884C",
  unread: "\u672A\u8BFB",
  read: "\u5DF2\u8BFB",
  next: "\u4E0B\u4E00\u9875",
  previous: "\u4E0A\u4E00\u9875",
  noRuns: "\u6682\u65E0\u8FD0\u884C\u8BB0\u5F55\u3002",
  choosePlan: "\u5728\u300C\u8BA2\u9605\u8BA1\u5212\u300D\u91CC\u9009\u62E9\u4E00\u6761\u539F\u751F\u4EFB\u52A1\uFF0C\u5F00\u59CB\u8DDF\u8E2A\u3002",
  noUnread: "\u672A\u8BFB\u8FD0\u884C\u5DF2\u5904\u7406\u5B8C\u3002",
  noPlans: "\u5728 DSH\u300C\u5B9A\u65F6\u4EFB\u52A1\u300D\u4E2D\u521B\u5EFA\u8BA1\u5212\u540E\uFF0C\u5237\u65B0\u8FD9\u91CC\u7684\u5217\u8868\u3002",
  chooseRun: "\u9009\u62E9\u4E00\u6761\u8FD0\u884C\u67E5\u770B\u9A8C\u6536\u4F9D\u636E\u3002",
  close: "\u5173\u95ED",
  change: "\u7F16\u8F91\u89C4\u5219",
  stop: "\u53D6\u6D88\u8BA2\u9605",
  track: "\u8BA2\u9605\u6B64\u8BA1\u5212",
  save: "\u4FDD\u5B58\u89C4\u5219",
  cancel: "\u53D6\u6D88",
  workspace: "\u5DE5\u4F5C\u533A",
  path: "\u62A5\u544A\u8DEF\u5F84",
  headingInput: "\u5FC5\u9700\u7684 Markdown \u6807\u9898\uFF0C\u6BCF\u884C\u4E00\u4E2A",
  example: "reports/{date}.md",
  preview: "\u9884\u8BA1\u9A8C\u6536\u8DEF\u5F84",
  ruleHelp: "{date} \u53D6\u8BA1\u5212\u65F6\u533A\u7684\u65E5\u671F\u3002\u7559\u7A7A\u65F6\u53EA\u8DDF\u8E2A\u6267\u884C\u3002",
  supported: "\u6BCF\u6B21\u65B0\u5EFA\u4F1A\u8BDD",
  session: "\u4F7F\u7528\u5DF2\u6709\u4F1A\u8BDD \xB7 \u4EC5\u652F\u6301\u6295\u9012\u8BC1\u636E",
  new_once: "\u9996\u6B21\u65B0\u5EFA\u4F1A\u8BDD \xB7 \u4EC5\u652F\u6301\u6295\u9012\u8BC1\u636E",
  active: "\u542F\u7528",
  paused: "\u6682\u505C",
  ended: "\u7ED3\u675F",
  tracked: "\u5DF2\u8BA2\u9605",
  delivery: "\u6295\u9012",
  execution: "\u6267\u884C",
  artifact: "\u4EA7\u7269",
  timeZone: "\u8BA1\u5212\u65F6\u533A",
  scheduled: "\u9884\u8BA1\u6295\u9012",
  deliveredAt: "\u5B9E\u9645\u6295\u9012",
  endedAt: "\u8F6E\u6B21\u7ED3\u675F",
  delivered: "\u5DF2\u6295\u9012",
  waiting: "\u7B49\u56DE\u6267",
  missed: "\u5C1A\u672A\u89C2\u5BDF\u5230\u56DE\u6267",
  pending: "\u7B49\u8F6E\u6B21\u63A5\u7EB3",
  running: "\u6267\u884C\u4E2D",
  completed: "\u6267\u884C\u5B8C\u6210",
  failed: "\u6267\u884C\u5931\u8D25",
  passed: "\u901A\u8FC7",
  rejected: "\u4E0D\u5408\u683C",
  unknown: "\u8BC1\u636E\u4E0D\u8DB3",
  noRule: "\u4EC5\u68C0\u67E5\u6267\u884C",
  notChecked: "\u672A\u68C0\u67E5",
  openSession: "\u6253\u5F00\u4F1A\u8BDD",
  openFile: "\u6253\u5F00\u5F53\u524D\u6587\u4EF6",
  revealFile: "\u5B9A\u4F4D\u6587\u4EF6",
  checkCurrent: "\u68C0\u67E5\u5F53\u524D\u7248\u672C",
  sessionId: "\u4F1A\u8BDD",
  messageId: "\u6D88\u606F",
  turn: "\u8F6E\u6B21",
  eventSeq: "\u4E8B\u4EF6\u5E8F\u53F7",
  reason: "\u7EC8\u6001",
  version: "\u9A8C\u6536\u65F6\u7248\u672C",
  beforeVersion: "\u8FD0\u884C\u524D\u7248\u672C",
  writeVersion: "\u8BE5\u8F6E\u5199\u5165\u7248\u672C",
  writeEvent: "\u5199\u5165\u7ED3\u679C\u4E8B\u4EF6",
  reviewedAt: "\u9A8C\u6536\u65F6\u95F4",
  currentVersion: "\u5F53\u524D\u7248\u672C",
  currentChanged: "\u6587\u4EF6\u5728\u9A8C\u6536\u540E\u53D1\u751F\u4E86\u53D8\u5316\u3002",
  sameVersion: "\u4E0E\u9A8C\u6536\u65F6\u7248\u672C\u4E00\u81F4\u3002",
  currentMissing: "\u8BE5\u6587\u4EF6\u5F53\u524D\u5DF2\u4E0D\u5B58\u5728\u3002",
  headingRules: "Markdown \u6807\u9898\u68C0\u67E5",
  rulePass: "\u5B58\u5728",
  ruleFail: "\u7F3A\u5931",
  unavailableHeading: "\u672A\u68C0\u67E5",
  noReceiptBoundary: "\u89C2\u5BDF\u7A97\u53E3\u5185\uFF0CDSH \u6301\u7EED\u663E\u793A\u8BE5\u6B21\u8BA1\u5212\u5E94\u6295\u9012\u3002\u622A\u81F3\u6700\u540E\u4E00\u6B21\u67E5\u8BE2\uFF0C\u672A\u627E\u5230\u5BF9\u5E94\u56DE\u6267\u3002",
  waitingBoundary: "DSH \u663E\u793A\u8BE5\u6B21\u8BA1\u5212\u5F85\u6295\u9012\u3002\u5BBF\u4E3B\u4FDD\u5B58\u56DE\u6267\u540E\uFF0C\u8FD9\u91CC\u4F1A\u66F4\u65B0\u3002",
  observedFrom: "\u5F00\u59CB\u89C2\u5BDF",
  observedThrough: "\u89C2\u5BDF\u622A\u81F3",
  readAction: "\u6807\u4E3A\u5DF2\u8BFB",
  unreadAction: "\u6807\u4E3A\u672A\u8BFB",
  emptyAction: "\u786E\u8BA4\u672C\u6B21\u65E0\u9700\u4EA7\u51FA",
  emptyConfirm: "\u5DF2\u4EBA\u5DE5\u786E\u8BA4\u672C\u6B21\u65E0\u9700\u4EA7\u51FA",
  manual: "\u4EBA\u5DE5\u67E5\u6536",
  stale: "\u6587\u4EF6\u7248\u672C\u4E0E\u8FD0\u884C\u524D\u4E00\u81F4\uFF0C\u672C\u6B21\u672A\u4EA7\u751F\u53EF\u9A8C\u8BC1\u7684\u66F4\u65B0\u3002",
  missing: "\u9A8C\u6536\u65F6\uFF0C\u9884\u671F\u8DEF\u5F84\u4E0A\u6CA1\u6709\u6587\u4EF6\u3002",
  verified: "\u5F53\u524D\u9A8C\u6536\u7248\u672C\u4E0E\u8BE5\u8F6E\u7684\u4E00\u6B21\u6210\u529F\u5199\u5165\u543B\u5408\u3002",
  headingsMissing: "\u8BE5\u8F6E\u5DF2\u5199\u5165\u6B64\u7248\u672C\uFF0C\u62A5\u544A\u7F3A\u5C11\u5FC5\u9700\u6807\u9898\u3002",
  unattributedChange: "\u6587\u4EF6\u8F83\u8FD0\u884C\u524D\u6709\u53D8\u5316\uFF0C\u5F53\u524D\u7248\u672C\u65E0\u6CD5\u5F52\u5C5E\u5230\u672C\u8F6E\u3002",
  unattributed: "\u6587\u4EF6\u5B58\u5728\uFF0C\u5F53\u524D\u7248\u672C\u65E0\u6CD5\u5F52\u5C5E\u5230\u672C\u8F6E\u3002",
  changedAfterWrite: "\u9A8C\u6536\u65F6\u7684\u6587\u4EF6\u7248\u672C\u4E0E\u672C\u8F6E\u6700\u540E\u4E00\u6B21\u786E\u8BA4\u5199\u5165\u7684\u7248\u672C\u4E0D\u540C\u3002",
  scopeChanged: "\u9A8C\u6536\u524D\u89C4\u5219\u6216\u5DE5\u4F5C\u533A\u53D1\u751F\u53D8\u5316\u3002",
  outsideWorkspace: "\u8BF7\u4F7F\u7528\u8BA1\u5212\u5DE5\u4F5C\u533A\u5185\u7684\u76F8\u5BF9\u8DEF\u5F84\u3002",
  notFile: "\u8BE5\u8DEF\u5F84\u4E0D\u662F\u5E38\u89C4\u6587\u4EF6\u3002",
  fileUnavailable: "\u65E0\u6CD5\u8BFB\u53D6\u6587\u4EF6\uFF0C\u53EF\u6253\u5F00\u4F1A\u8BDD\u6838\u67E5\u3002",
  unstable: "\u8BFB\u53D6\u671F\u95F4\u6587\u4EF6\u53D1\u751F\u53D8\u5316\u3002",
  tooLarge: "\u62A5\u544A\u8D85\u8FC7 256 KiB\uFF0C\u65E0\u6CD5\u68C0\u67E5\u6807\u9898\u3002",
  notText: "\u62A5\u544A\u4E0D\u662F UTF-8 \u6587\u672C\u3002",
  noAcceptance: "\u73B0\u6709\u4F1A\u8BDD\u65E5\u5FD7\u4E2D\u672A\u627E\u5230\u5339\u914D\u7684\u8F6E\u6B21\u8F93\u5165\u3002",
  noTerminal: "\u5339\u914D\u8F6E\u6B21\u6CA1\u6709\u7ED3\u675F\u8BB0\u5F55\u3002",
  ambiguous: "\u56DE\u6267\u65E0\u6CD5\u552F\u4E00\u5173\u8054\u5230\u4E00\u4E2A\u65B0\u5EFA\u4F1A\u8BDD\u4E2D\u7684\u8F6E\u6B21\u3002",
  sessionUnavailable: "\u65E0\u6CD5\u8BFB\u53D6\u5BF9\u5E94\u4F1A\u8BDD\u65E5\u5FD7\u3002",
  modeUnsupported: "\u5171\u4EAB\u4F1A\u8BDD\u6A21\u5F0F\u4EC5\u652F\u6301\u6295\u9012\u8BC1\u636E\u3002",
  catalogUnavailable: "\u65E0\u6CD5\u8BFB\u53D6 DSH \u8BA1\u5212\uFF0C\u8BF7\u5237\u65B0\u91CD\u8BD5\u3002",
  historyUnavailable: "\u90E8\u5206 DSH \u6295\u9012\u8BB0\u5F55\u8BFB\u53D6\u4E0D\u5B8C\u6574\uFF0C\u8BF7\u5237\u65B0\u91CD\u8BD5\u3002",
  storageUnavailable: "\u65E0\u6CD5\u6253\u5F00\u6B64 profile \u7684\u9A8C\u6536\u8BB0\u5F55\u3002\u8BF7\u68C0\u67E5\u6743\u9650\u540E\u91CD\u542F DSH\u3002",
  unavailable: "\u8BF7\u6C42\u672A\u5B8C\u6210\uFF0C\u8BF7\u5237\u65B0\u540E\u91CD\u8BD5\u3002",
  invalidPlan: "\u6B64\u8BA1\u5212\u5DF2\u65E0\u6CD5\u8BA2\u9605\uFF0C\u8BF7\u5237\u65B0\u8BA1\u5212\u5217\u8868\u3002",
  invalidRule: "\u8BF7\u4F7F\u7528\u5DE5\u4F5C\u533A\u76F8\u5BF9\u8DEF\u5F84\u3002Markdown \u62A5\u544A\u6700\u591A\u53EF\u586B\u5199 12 \u4E2A\u5FC5\u9700\u6807\u9898\u3002",
  invalidRun: "\u8BE5\u8FD0\u884C\u8BB0\u5F55\u5DF2\u4E0D\u53EF\u7528\uFF0C\u8BF7\u5237\u65B0\u5217\u8868\u3002",
  denied: "\u9700\u8981 DSH \u4E3B\u4EBA\u6743\u9650\uFF0C\u8BF7\u4ECE DSH \u91CD\u65B0\u6253\u5F00\u3002",
  openFailed: "DSH \u672A\u80FD\u6253\u5F00\u6B64\u9879\uFF0C\u8BF7\u56DE\u5230\u5BF9\u5E94\u4F1A\u8BDD\u6216\u5DE5\u4F5C\u533A\u67E5\u627E\u3002",
  compatibilityChanged: "\u8BA1\u5212\u5DE5\u4F5C\u533A\u6216\u65F6\u533A\u5DF2\u53D8\u66F4\uFF0C\u8BF7\u6838\u5BF9\u5E76\u4FDD\u5B58\u89C4\u5219\u3002"
};

// src/client.jsx
var import_jsx_runtime = require("react/jsx-runtime");
var id = "run-receipt";
var ns = "run-receipt";
var chunk = 30;
async function request(payload, signal) {
  const response = await fetch("api/run-receipt", payload ? {
    method: "POST",
    credentials: "same-origin",
    signal,
    headers: { "content-type": "application/json", "x-dsh-plugin": "dsh-run-receipt" },
    body: JSON.stringify(payload)
  } : { signal, credentials: "same-origin" });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) throw new Error(data?.error ?? (response.status === 403 ? "denied" : "unavailable"));
  return data;
}
function dateTime(value, zone, locale) {
  if (value === null || value === void 0) return "\u2014";
  return new Intl.DateTimeFormat(locale, {
    timeZone: zone,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).format(new Date(value));
}
function preview(path, at, zone) {
  if (!path || !at) return path;
  const parts = new Intl.DateTimeFormat("en", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(at));
  return path.replaceAll("{date}", ["year", "month", "day"].map((type) => parts.find((part) => part.type === type).value).join("-"));
}
function deliverStatus(row) {
  if (row.receipt) return "delivered";
  return row.expectation === "missing" ? "missed" : "waiting";
}
function reportStatus(row) {
  if (row.artifact) return row.artifact.status;
  return row.rule?.path ? "notChecked" : "noRule";
}
function Pill({ label, status, t }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "rr-pill", "data-state": status, title: t(label), children: t(status) });
}
function RunRow({ row, selected, onSelect, t, locale }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "button",
    {
      className: "rr-row",
      type: "button",
      "aria-current": selected ? "true" : void 0,
      "data-run-key": row.key,
      onClick: onSelect,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "rr-row-title", children: [
          row.manual?.readAt ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "rr-unread", "aria-label": t("unread") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: row.title }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { dateTime: row.at, children: dateTime(row.at, row.zone, locale) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "rr-states", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, { label: "delivery", status: deliverStatus(row), t }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, { label: "execution", status: row.execution?.status ?? (row.receipt ? "pending" : "notChecked"), t }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, { label: "artifact", status: reportStatus(row), t }),
          row.manual?.emptyAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "rr-manual-tag", children: t("emptyConfirm") })
        ] })
      ]
    }
  );
}
function Field({ label, children, code = false }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: code ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children }) : children })
  ] });
}
function Detail({ row, t, locale, actions, onClose }) {
  const [current, setCurrent] = (0, import_react.useState)(null);
  const [issue, setIssue] = (0, import_react.useState)("");
  const [checking, setChecking] = (0, import_react.useState)(false);
  const controller = (0, import_react.useRef)();
  const element = (0, import_react.useRef)();
  const { rule, artifact, execution, receipt, observation, manual } = row;
  const canCheck = Boolean(rule?.path && receipt && execution?.turn && row.final && !row.scopeChanged);
  (0, import_react.useEffect)(() => () => controller.current?.abort(), []);
  (0, import_react.useEffect)(() => {
    if (element.current?.closest(".rr-panel")?.clientWidth <= 740) {
      element.current.scrollIntoView({ block: "start" });
    }
  }, []);
  async function checkCurrent() {
    controller.current?.abort();
    const active = new AbortController();
    controller.current = active;
    setChecking(true);
    setIssue("");
    try {
      const value = await request({ op: "current", key: row.key }, active.signal);
      if (!active.signal.aborted) setCurrent(value);
    } catch (error) {
      if (!active.signal.aborted) setIssue(error.message);
    } finally {
      if (!active.signal.aborted) setChecking(false);
    }
  }
  async function open(path, action) {
    try {
      await actions.openFile(path, action);
    } catch {
      setIssue("openFailed");
    }
  }
  function openSession() {
    try {
      actions.openSession(receipt.targetSessionId);
    } catch {
      setIssue("openFailed");
    }
  }
  const dt = (value) => dateTime(value, row.zone, locale);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { ref: element, className: "rr-detail", "aria-label": row.title, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "rr-detail-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: row.title }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { size: "sm", onClick: onClose, children: t("close") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: [
        t("delivery"),
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, { label: "delivery", status: deliverStatus(row), t })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: t("timeZone"), children: row.zone }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: t("scheduled"), children: dt(row.at) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: t("deliveredAt"), children: dt(receipt?.deliveredAt) }),
        receipt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: t("messageId"), code: true, children: receipt.messageId }),
        observation && !receipt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: t("observedFrom"), children: dt(observation.first) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: t("observedThrough"), children: dt(observation.last) })
        ] })
      ] }),
      !receipt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t(row.expectation === "missing" ? "noReceiptBoundary" : "waitingBoundary") })
    ] }),
    receipt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: [
        t("execution"),
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, { label: "execution", status: execution?.status ?? "pending", t })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: t("sessionId"), code: true, children: receipt.targetSessionId }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: t("turn"), children: execution?.turn ?? "\u2014" }),
        execution?.turn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: t("eventSeq"), code: true, children: [execution.startSeq, execution.messageSeq, execution.endSeq].filter(Number.isInteger).join(" \u2192 ") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: t("endedAt"), children: dt(execution?.endedAt) }),
        execution?.endSeq && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: t("reason"), code: true, children: execution.reason })
      ] }),
      execution?.reason && !execution.endSeq && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t(execution.reason) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { size: "sm", variant: "outline", onClick: openSession, children: t("openSession") })
    ] }),
    rule?.path && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: [
        t("artifact"),
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, { label: "artifact", status: reportStatus(row), t })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: t("path"), code: true, children: rule.path }),
        artifact?.checkedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: t("reviewedAt"), children: dt(artifact.checkedAt) }),
        artifact?.baseline?.version && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: t("beforeVersion"), code: true, children: artifact.baseline.version }),
        artifact?.version && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: t("version"), code: true, children: artifact.version }),
        artifact?.write && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: t("writeVersion"), code: true, children: artifact.write.version }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: t("writeEvent"), code: true, children: artifact.write.resultSeq })
        ] }),
        current?.version && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: t("currentVersion"), code: true, children: current.version })
      ] }),
      artifact?.reason && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t(artifact.reason) }),
      rule.headings.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: t("headingRules") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "rr-checks", children: rule.headings.map((heading) => {
          const result = artifact?.checks?.find((item) => item.heading === heading);
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: heading }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t(result ? result.pass ? "rulePass" : "ruleFail" : "unavailableHeading") })
          ] }, heading);
        }) })
      ] }),
      current && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { role: "status", children: t(current.state === "present" ? artifact?.version ? current.version === artifact.version && current.absolutePath === artifact.absolutePath ? "sameVersion" : "currentChanged" : "unattributed" : current.state === "missing" ? "currentMissing" : current.state) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "rr-actions", children: [
        canCheck && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { size: "sm", variant: "outline", disabled: checking, onClick: checkCurrent, children: t("checkCurrent") }),
        current?.state === "present" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { size: "sm", variant: "outline", onClick: () => open(current.absolutePath, "open"), children: t("openFile") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { size: "sm", onClick: () => open(current.absolutePath, "reveal"), children: t("revealFile") })
        ] })
      ] })
    ] }),
    receipt || row.expectation === "missing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: t("manual") }),
      manual?.emptyAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
        t("emptyConfirm"),
        " \xB7 ",
        dt(manual.emptyAt)
      ] }),
      manual?.readAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
        t("read"),
        " \xB7 ",
        dt(manual.readAt)
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "rr-actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_dsh_client_ui_primitives.Button,
          {
            size: "sm",
            variant: "outline",
            disabled: actions.busy,
            onClick: () => actions.mark(row.key, manual?.readAt ? "unread" : "read"),
            children: t(manual?.readAt ? "unreadAction" : "readAction")
          }
        ),
        execution?.status === "completed" && !manual?.emptyAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_dsh_client_ui_primitives.Button,
          {
            size: "sm",
            disabled: actions.busy,
            onClick: () => actions.mark(row.key, "empty"),
            children: t("emptyAction")
          }
        )
      ] })
    ] }) : null,
    issue && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "rr-error", role: "alert", children: translateError(issue, t) })
  ] });
}
function RuleEditor({ task, t, save, close, busy }) {
  const [path, setPath] = (0, import_react.useState)(task.watch?.path ?? "");
  const [headings, setHeadings] = (0, import_react.useState)(task.watch?.headings?.join("\n") ?? "");
  const submit = (event) => {
    event.preventDefault();
    return save({
      op: "watch",
      id: task.id,
      on: true,
      path,
      headings: headings.split("\n").map((line) => line.trim()).filter(Boolean)
    });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", { className: "rr-form", onSubmit: submit, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "rr-secondary", children: t("workspace") }),
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: task.root ?? "\u2014" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
      t("path"),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: path, onChange: (event) => setPath(event.target.value), placeholder: t("example"), maxLength: 400, autoFocus: true })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("ruleHelp") }),
    path && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "rr-secondary", children: t("preview") }),
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: preview(path, task.at, task.zone) }),
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "rr-secondary", children: [
        "(",
        task.zone,
        ")"
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
      t("headingInput"),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { value: headings, onChange: (event) => setHeadings(event.target.value), rows: 3, maxLength: 1950 })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "rr-actions", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { type: "submit", variant: "primary", size: "sm", disabled: busy, children: t("save") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { size: "sm", onClick: close, children: t("cancel") })
    ] })
  ] });
}
function translateError(code, t) {
  return Object.hasOwn(en, code) ? t(code) : t("unavailable");
}
function Panel({ t, openSession, openFile }) {
  const [view, setView] = (0, import_react.useState)(null);
  const [tab, setTab] = (0, import_react.useState)("runs");
  const [selected, setSelected] = (0, import_react.useState)(null);
  const [editing, setEditing] = (0, import_react.useState)(null);
  const [onlyUnread, setOnlyUnread] = (0, import_react.useState)(false);
  const [page, setPage] = (0, import_react.useState)(0);
  const [issue, setIssue] = (0, import_react.useState)("");
  const [busy, setBusy] = (0, import_react.useState)(false);
  const owner = (0, import_react.useRef)();
  const sequence = (0, import_react.useRef)(0);
  const working = (0, import_react.useRef)(false);
  const locale = t("runs") === zh.runs ? "zh-CN" : "en";
  async function update(payload) {
    const signal = owner.current?.signal;
    if (!signal || signal.aborted || working.current) return false;
    const seq = ++sequence.current;
    if (payload) {
      working.current = true;
      setBusy(true);
      setIssue("");
    }
    try {
      const data = await request(payload, signal);
      if (!signal.aborted && seq === sequence.current) {
        setView(data);
        setIssue("");
        return true;
      }
    } catch (error) {
      if (!signal.aborted && seq === sequence.current) setIssue(error.message);
    } finally {
      if (payload && !signal.aborted) {
        working.current = false;
        setBusy(false);
      }
    }
    return false;
  }
  (0, import_react.useEffect)(() => {
    const active = new AbortController();
    owner.current = active;
    working.current = false;
    void update({ op: "refresh" });
    const timer = setInterval(() => {
      if (!document.hidden) void update();
    }, 5e3);
    return () => {
      active.abort();
      clearInterval(timer);
    };
  }, []);
  const rows = (view?.rows ?? []).filter((row) => !onlyUnread || !row.manual?.readAt);
  const pageIndex = Math.min(page, Math.max(0, Math.ceil(rows.length / chunk) - 1));
  const matchingRuns = selected && !selected.receipt ? view?.rows.filter((row) => row.receipt && row.taskId === selected.taskId && row.at === selected.at) ?? [] : [];
  const selectedRow = view?.rows.find((row) => row.key === selected?.key) ?? (matchingRuns.length === 1 ? matchingRuns[0] : null);
  const tracked = view?.plans.some((task) => task.watch?.on);
  const save = async (payload) => {
    if (await update(payload)) setEditing(null);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { className: "rr-panel", "data-run-receipt": "", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "rr-container", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { className: "rr-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: t("title") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { variant: "outline", onClick: () => update({ op: "refresh" }), disabled: busy, children: t("refresh") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", { className: "rr-tabs", "aria-label": t("title"), children: ["runs", "plans"].map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "button",
      {
        type: "button",
        "aria-current": tab === name ? "page" : void 0,
        onClick: () => setTab(name),
        children: t(name)
      },
      name
    )) }),
    (issue || view?.failure) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "rr-error", role: "alert", children: translateError(issue || view.failure, t) }),
    !view && !issue && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { role: "status", children: t("loading") }),
    view && (tab === "plans" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "rr-plans", children: [
      view.plans.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("noPlans") }),
      view.plans.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "rr-plan", "data-plan-id": task.id, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "rr-plan-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: task.title }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
              t(task.mode === "new" ? "supported" : task.mode),
              " \xB7 ",
              t(task.status),
              task.watch?.on ? " \xB7 " + t("tracked") : ""
            ] }),
            task.watch?.on && task.watch.path && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: preview(task.watch.path, task.at, task.watch.zone) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "rr-actions", children: [
            task.mode === "new" && editing !== task.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { size: "sm", variant: "outline", onClick: () => setEditing(task.id), children: t(task.watch?.on ? "change" : "track") }),
            task.watch?.on && editing !== task.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { size: "sm", disabled: busy, onClick: () => save({
              op: "watch",
              id: task.id,
              on: false,
              path: task.watch.path ?? "",
              headings: task.watch.headings
            }), children: t("stop") })
          ] })
        ] }),
        task.watch?.on && (task.watch.zone !== task.zone || task.watch.root !== task.root) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "rr-error", children: t("compatibilityChanged") }),
        editing === task.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleEditor, { task, t, save, close: () => setEditing(null), busy }, task.id)
      ] }, task.id))
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "rr-filter", "aria-label": t("runs"), children: [false, true].map((filter) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_dsh_client_ui_primitives.Button,
        {
          size: "sm",
          variant: filter === onlyUnread ? "outline" : "ghost",
          "aria-pressed": filter === onlyUnread,
          onClick: () => {
            setOnlyUnread(filter);
            setPage(0);
          },
          children: t(filter ? "unread" : "all")
        },
        String(filter)
      )) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "rr-inbox", "data-selected": Boolean(selectedRow), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "rr-list", children: [
          rows.length ? rows.slice(pageIndex * chunk, (pageIndex + 1) * chunk).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            RunRow,
            {
              row,
              t,
              locale,
              selected: selectedRow?.key === row.key,
              onSelect: () => setSelected(row)
            },
            row.key
          )) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "rr-empty", children: t(onlyUnread ? "noUnread" : tracked ? "noRuns" : "choosePlan") }),
          rows.length > chunk && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "rr-actions rr-pagination", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { size: "sm", disabled: !pageIndex, onClick: () => setPage(pageIndex - 1), children: t("previous") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { size: "sm", disabled: (pageIndex + 1) * chunk >= rows.length, onClick: () => setPage(pageIndex + 1), children: t("next") })
          ] })
        ] }),
        selectedRow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Detail,
          {
            row: selectedRow,
            t,
            locale,
            onClose: () => setSelected(null),
            actions: { busy, openSession, openFile, mark: (key, action) => update({ op: "mark", key, action }) }
          },
          selectedRow.key
        )
      ] })
    ] }))
  ] }) });
}
function NavIcon({ size }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.IconArchiveCheckOutlineRegular, { size });
}
var inject = ["slots", "locale", "uiWorkspace", "remote", "sessions", "workspaces"];
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(ns, { zh, en }));
  ctx.effect(() => {
    const style = document.createElement("style");
    style.textContent = '.rr-panel {\n  container-type: inline-size;\n  height: 100%;\n  min-height: 0;\n  overflow: auto;\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-alias-bg-base);\n  font-size: 14px;\n  line-height: 1.55;\n}\n.rr-panel * { box-sizing: border-box; }\n.rr-container { max-width: 1240px; margin-inline: auto; padding: calc(24px + var(--dsh-frame-top-clearance, 0px)) clamp(16px, 4cqi, 48px) 32px; }\n.rr-header, .rr-detail-head, .rr-plan-head, .rr-row-title, .rr-actions {\n  display: flex; align-items: center; gap: 10px;\n}\n.rr-header, .rr-detail-head, .rr-plan-head { justify-content: space-between; }\n.rr-header h1 { margin: 0; font-size: clamp(23px, 4cqi, 32px); line-height: 1.25; letter-spacing: -.025em; font-weight: 650; }\n.rr-header button, .rr-detail-head button { flex-shrink: 0; }\n.rr-tabs { display: flex; gap: 24px; margin-top: 22px; border-bottom: 1px solid var(--dsw-alias-border-l3); }\n.rr-tabs button { padding: 9px 1px; background: transparent; border: 0; border-bottom: 2px solid transparent; color: var(--dsw-alias-label-secondary); font: inherit; cursor: pointer; }\n.rr-tabs button[aria-current] { color: var(--dsw-alias-label-primary); border-bottom-color: currentColor; font-weight: 600; }\n.rr-filter, .rr-actions, .rr-states { display: flex; flex-wrap: wrap; }\n.rr-filter { gap: 6px; margin: 16px 0 10px; }\n.rr-inbox { display: grid; grid-template-columns: minmax(0, 1fr); gap: 18px; align-items: start; }\n.rr-inbox[data-selected="true"] { grid-template-columns: minmax(0, 1fr) minmax(0, .92fr); }\n.rr-list, .rr-plans { min-width: 0; }\n.rr-list, .rr-detail, .rr-plan { border: 1px solid var(--dsw-alias-border-l3); border-radius: 14px; }\n.rr-list { overflow: hidden; }\n.rr-row { display: block; width: 100%; min-width: 0; padding: 15px 17px; text-align: start; background: transparent; border: 0; border-bottom: 1px solid var(--dsw-alias-border-l3); color: inherit; cursor: pointer; font: inherit; }\n.rr-row:last-child { border-bottom: 0; }\n.rr-row:hover, .rr-row[aria-current] { background: var(--dsw-alias-interactive-bg-hover); }\n.rr-row[aria-current] { box-shadow: inset 3px 0 var(--dsw-alias-label-primary); }\n.rr-row-title { flex-wrap: wrap; }\n.rr-row-title strong { min-width: 0; overflow-wrap: anywhere; font-weight: 600; }\n.rr-row-title time { margin-inline-start: auto; white-space: nowrap; color: var(--dsw-alias-label-secondary); font-size: 12px; font-variant-numeric: tabular-nums; }\n.rr-unread { width: 7px; height: 7px; border-radius: 50%; flex: none; background: #4274dd; }\n.rr-states { gap: 6px; margin-top: 8px; }\n.rr-pill { padding: 1px 8px; border-radius: 6px; font-size: 12px; font-weight: 530; line-height: 1.6; background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-secondary); }\n.rr-pill[data-state="passed"] { background: light-dark(#e7f4ec, #173c2a); color: light-dark(#235e3e, #a2dfbd); }\n.rr-pill[data-state="failed"], .rr-pill[data-state="rejected"] { background: light-dark(#fbeeea, #4b2425); color: light-dark(#a03935, #ffb1a8); }\n.rr-pill[data-state="missed"], .rr-pill[data-state="unknown"] { background: light-dark(#f8efd9, #46371b); color: light-dark(#785417, #f4d28e); }\n.rr-pill[data-state="running"], .rr-pill[data-state="delivered"] { background: light-dark(#eaf0fc, #213451); color: light-dark(#2b5090, #b2cdfa); }\n.rr-manual-tag, .rr-secondary { color: var(--dsw-alias-label-secondary); font-size: 12px; }\n.rr-detail { min-width: 0; overflow: hidden; }\n.rr-detail-head, .rr-detail > section { padding: 14px 16px; }\n.rr-detail > section { border-top: 1px solid var(--dsw-alias-border-l3); }\n.rr-detail h2, .rr-plan h2 { margin: 0; font-weight: 620; font-size: 16px; overflow-wrap: anywhere; }\n.rr-detail h3, .rr-detail h4 { margin: 0 0 8px; font-weight: 610; font-size: 13px; }\n.rr-detail h3 .rr-pill { margin-inline-start: 5px; }\n.rr-panel dl { display: grid; grid-template-columns: minmax(72px, auto) minmax(0, 1fr); gap: 4px 12px; margin: 0 0 10px; font-size: 12px; }\n.rr-panel dt, .rr-panel p { color: var(--dsw-alias-label-secondary); }\n.rr-panel p { margin: 8px 0; }\n.rr-panel dd { min-width: 0; margin: 0; overflow-wrap: anywhere; }\n.rr-panel code { font-size: 12px; overflow-wrap: anywhere; }\n.rr-checks { list-style: none; padding: 0; margin: 6px 0 12px; }\n.rr-checks li { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; padding: 4px 0; border-bottom: 1px solid var(--dsw-alias-border-l3); overflow-wrap: anywhere; font-size: 12px; }\n.rr-checks li span:last-child { color: var(--dsw-alias-label-secondary); flex: none; }\n.rr-plans { display: grid; gap: 12px; margin-top: 16px; }\n.rr-plan { padding: 14px 16px; }\n.rr-plan-head { align-items: flex-start; flex-wrap: wrap; }\n.rr-plan-head p { margin: 3px 0; font-size: 13px; }\n.rr-form { display: grid; gap: 9px; border-top: 1px solid var(--dsw-alias-border-l3); margin-top: 12px; padding-top: 12px; }\n.rr-form label { display: grid; gap: 4px; font-size: 13px; }\n.rr-form p { margin: 0; font-size: 12px; }\n.rr-form input, .rr-form textarea { width: 100%; min-width: 0; padding: 7px 10px; background: var(--dsw-alias-bg-base); color: inherit; border: 1px solid var(--dsw-alias-border-l3); border-radius: 8px; font: inherit; }\n.rr-form textarea { resize: vertical; }\n.rr-panel button:focus-visible, .rr-form :is(input,textarea):focus-visible { outline: 2px solid #6f99fb; outline-offset: -2px; }\n.rr-panel .rr-error { color: light-dark(#a03935, #ffb1a8); font-size: 13px; margin: 10px 0; overflow-wrap: anywhere; }\n.rr-detail > .rr-error { margin-inline: 16px; }\n.rr-panel .rr-empty, .rr-pagination { margin: 0; padding: 16px; }\n@container (max-width: 740px) {\n  .rr-inbox[data-selected="true"] { grid-template-columns: minmax(0, 1fr); }\n  .rr-inbox[data-selected="true"] .rr-detail { grid-row: 1; }\n}\n@container (max-width: 390px) {\n  .rr-container { padding-inline: 12px; }\n  .rr-header { gap: 6px; }\n  .rr-row { padding-inline: 12px; }\n  .rr-row-title time { width: 100%; margin-inline-start: 0; }\n}\n';
    document.head.append(style);
    return () => style.remove();
  });
  ctx.slots.inject("main", () => ctx.slots.register({
    name: "main",
    key: id,
    locale: ns,
    inject: () => ({
      openSession: (sessionId) => {
        const sessions = ctx.sessions.list.getSnapshot();
        const workspace = ctx.workspaces.list.getSnapshot();
        if (!sessions.ids.includes(sessionId) || workspace.archivedSessionIds.includes(sessionId)) {
          throw new Error("openFailed");
        }
        ctx.uiWorkspace.openSession(sessionId);
      },
      openFile: async (path, action) => {
        const result = await ctx.remote.session.openWorkspacePath({ path, action });
        if (!result?.ok) throw new Error("openFailed");
      }
    })
  }, Panel));
  ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
    name: "sidebar.panellist",
    id,
    order: 11,
    locale: ns,
    label: () => ctx.locale.bind(ns)("title")
  }, NavIcon));
}

    return module.exports
  }
  window.__ModuleLoader__.load({ id: '@jidekaixin2dian/dsh-run-receipt', factory })
})()
