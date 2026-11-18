// src/index.js
import { join } from "node:path";

// src/store.js
import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
function ledgerAt(path) {
  let state;
  try {
    state = JSON.parse(readFileSync(path, "utf8"));
    if (state?.schema !== 1 || !isRecord(state.watches) || !isRecord(state.rows) || !isRecord(state.proofs)) {
      throw new Error("Invalid Run Receipt ledger");
    }
  } catch (error2) {
    if (error2.code !== "ENOENT") throw error2;
    state = { schema: 1, watches: {}, rows: {}, proofs: {} };
  }
  return {
    get state() {
      return state;
    },
    save(next) {
      if (JSON.stringify(state) === JSON.stringify(next)) return;
      mkdirSync(dirname(path), { recursive: true });
      const temporary = path + ".next";
      writeFileSync(temporary, JSON.stringify(next) + "\n", { mode: 384, flush: true });
      renameSync(temporary, path);
      state = next;
    }
  };
}
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// src/monitor.js
import { isAbsolute, relative, resolve } from "node:path";

// node_modules/marked/lib/marked.esm.js
function M() {
  return { async: false, breaks: false, extensions: null, gfm: true, hooks: null, pedantic: false, renderer: null, silent: false, tokenizer: null, walkTokens: null };
}
var T = M();
function G(u3) {
  T = u3;
}
var _ = { exec: () => null };
function k(u3, e = "") {
  let t = typeof u3 == "string" ? u3 : u3.source, n = { replace: (r, i) => {
    let s = typeof i == "string" ? i : i.source;
    return s = s.replace(m.caret, "$1"), t = t.replace(r, s), n;
  }, getRegex: () => new RegExp(t, e) };
  return n;
}
var be = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return false;
  }
})();
var m = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (u3) => new RegExp(`^( {0,3}${u3})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}#`), htmlBeginRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}>`) };
var Re = /^(?:[ \t]*(?:\n|$))+/;
var Te = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
var Oe = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
var C = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
var we = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
var Q = / {0,3}(?:[*+-]|\d{1,9}[.)])/;
var se = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
var ie = k(se).replace(/bull/g, Q).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
var ye = k(se).replace(/bull/g, Q).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
var j = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
var Pe = /^[^\n]+/;
var F = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/;
var Se = k(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", F).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
var $e = k(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Q).getRegex();
var v = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
var U = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
var _e = k("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", U).replace("tag", v).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
var oe = k(j).replace("hr", C).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex();
var Le = k(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", oe).getRegex();
var K = { blockquote: Le, code: Te, def: Se, fences: Oe, heading: we, hr: C, html: _e, lheading: ie, list: $e, newline: Re, paragraph: oe, table: _, text: Pe };
var ne = k("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", C).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex();
var Me = { ...K, lheading: ye, table: ne, paragraph: k(j).replace("hr", C).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", ne).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex() };
var ze = { ...K, html: k(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", U).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: _, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: k(j).replace("hr", C).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ie).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() };
var Ee = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
var Ie = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
var ae = /^( {2,}|\\)\n(?!\s*$)/;
var Ae = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
var z = /[\p{P}\p{S}]/u;
var H = /[\s\p{P}\p{S}]/u;
var W = /[^\s\p{P}\p{S}]/u;
var Ce = k(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, H).getRegex();
var le = /(?!~)[\p{P}\p{S}]/u;
var Be = /(?!~)[\s\p{P}\p{S}]/u;
var De = /(?:[^\s\p{P}\p{S}]|~)/u;
var qe = k(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", be ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex();
var ue = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/;
var ve = k(ue, "u").replace(/punct/g, z).getRegex();
var He = k(ue, "u").replace(/punct/g, le).getRegex();
var pe = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)";
var Ze = k(pe, "gu").replace(/notPunctSpace/g, W).replace(/punctSpace/g, H).replace(/punct/g, z).getRegex();
var Ge = k(pe, "gu").replace(/notPunctSpace/g, De).replace(/punctSpace/g, Be).replace(/punct/g, le).getRegex();
var Ne = k("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, W).replace(/punctSpace/g, H).replace(/punct/g, z).getRegex();
var Qe = k(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, z).getRegex();
var je = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)";
var Fe = k(je, "gu").replace(/notPunctSpace/g, W).replace(/punctSpace/g, H).replace(/punct/g, z).getRegex();
var Ue = k(/\\(punct)/, "gu").replace(/punct/g, z).getRegex();
var Ke = k(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
var We = k(U).replace("(?:-->|$)", "-->").getRegex();
var Xe = k("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", We).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
var q = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/;
var Je = k(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", q).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
var ce = k(/^!?\[(label)\]\[(ref)\]/).replace("label", q).replace("ref", F).getRegex();
var he = k(/^!?\[(ref)\](?:\[\])?/).replace("ref", F).getRegex();
var Ve = k("reflink|nolink(?!\\()", "g").replace("reflink", ce).replace("nolink", he).getRegex();
var re = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/;
var X = { _backpedal: _, anyPunctuation: Ue, autolink: Ke, blockSkip: qe, br: ae, code: Ie, del: _, delLDelim: _, delRDelim: _, emStrongLDelim: ve, emStrongRDelimAst: Ze, emStrongRDelimUnd: Ne, escape: Ee, link: Je, nolink: he, punctuation: Ce, reflink: ce, reflinkSearch: Ve, tag: Xe, text: Ae, url: _ };
var Ye = { ...X, link: k(/^!?\[(label)\]\((.*?)\)/).replace("label", q).getRegex(), reflink: k(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", q).getRegex() };
var N = { ...X, emStrongRDelimAst: Ge, emStrongLDelim: He, delLDelim: Qe, delRDelim: Fe, url: k(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", re).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: k(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", re).getRegex() };
var et = { ...N, br: k(ae).replace("{2,}", "*").getRegex(), text: k(N.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() };
var B = { normal: K, gfm: Me, pedantic: ze };
var E = { normal: X, gfm: N, breaks: et, pedantic: Ye };
var tt = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
var ke = (u3) => tt[u3];
function O(u3, e) {
  if (e) {
    if (m.escapeTest.test(u3)) return u3.replace(m.escapeReplace, ke);
  } else if (m.escapeTestNoEncode.test(u3)) return u3.replace(m.escapeReplaceNoEncode, ke);
  return u3;
}
function J(u3) {
  try {
    u3 = encodeURI(u3).replace(m.percentDecode, "%");
  } catch {
    return null;
  }
  return u3;
}
function V(u3, e) {
  let t = u3.replace(m.findPipe, (i, s, a) => {
    let o = false, l = s;
    for (; --l >= 0 && a[l] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), n = t.split(m.splitPipe), r = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e) if (n.length > e) n.splice(e);
  else for (; n.length < e; ) n.push("");
  for (; r < n.length; r++) n[r] = n[r].trim().replace(m.slashPipe, "|");
  return n;
}
function I(u3, e, t) {
  let n = u3.length;
  if (n === 0) return "";
  let r = 0;
  for (; r < n; ) {
    let i = u3.charAt(n - r - 1);
    if (i === e && !t) r++;
    else if (i !== e && t) r++;
    else break;
  }
  return u3.slice(0, n - r);
}
function de(u3, e) {
  if (u3.indexOf(e[1]) === -1) return -1;
  let t = 0;
  for (let n = 0; n < u3.length; n++) if (u3[n] === "\\") n++;
  else if (u3[n] === e[0]) t++;
  else if (u3[n] === e[1] && (t--, t < 0)) return n;
  return t > 0 ? -2 : -1;
}
function ge(u3, e = 0) {
  let t = e, n = "";
  for (let r of u3) if (r === "	") {
    let i = 4 - t % 4;
    n += " ".repeat(i), t += i;
  } else n += r, t++;
  return n;
}
function fe(u3, e, t, n, r) {
  let i = e.href, s = e.title || null, a = u3[1].replace(r.other.outputLinkReplace, "$1");
  n.state.inLink = true;
  let o = { type: u3[0].charAt(0) === "!" ? "image" : "link", raw: t, href: i, title: s, text: a, tokens: n.inlineTokens(a) };
  return n.state.inLink = false, o;
}
function nt(u3, e, t) {
  let n = u3.match(t.other.indentCodeCompensation);
  if (n === null) return e;
  let r = n[1];
  return e.split(`
`).map((i) => {
    let s = i.match(t.other.beginningSpace);
    if (s === null) return i;
    let [a] = s;
    return a.length >= r.length ? i.slice(r.length) : i;
  }).join(`
`);
}
var w = class {
  options;
  rules;
  lexer;
  constructor(e) {
    this.options = e || T;
  }
  space(e) {
    let t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0) return { type: "space", raw: t[0] };
  }
  code(e) {
    let t = this.rules.block.code.exec(e);
    if (t) {
      let n = t[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: t[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : I(n, `
`) };
    }
  }
  fences(e) {
    let t = this.rules.block.fences.exec(e);
    if (t) {
      let n = t[0], r = nt(n, t[3] || "", this.rules);
      return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: r };
    }
  }
  heading(e) {
    let t = this.rules.block.heading.exec(e);
    if (t) {
      let n = t[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let r = I(n, "#");
        (this.options.pedantic || !r || this.rules.other.endingSpaceChar.test(r)) && (n = r.trim());
      }
      return { type: "heading", raw: t[0], depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(e) {
    let t = this.rules.block.hr.exec(e);
    if (t) return { type: "hr", raw: I(t[0], `
`) };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = I(t[0], `
`).split(`
`), r = "", i = "", s = [];
      for (; n.length > 0; ) {
        let a = false, o = [], l;
        for (l = 0; l < n.length; l++) if (this.rules.other.blockquoteStart.test(n[l])) o.push(n[l]), a = true;
        else if (!a) o.push(n[l]);
        else break;
        n = n.slice(l);
        let p = o.join(`
`), c = p.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${p}` : p, i = i ? `${i}
${c}` : c;
        let d = this.lexer.state.top;
        if (this.lexer.state.top = true, this.lexer.blockTokens(c, s, true), this.lexer.state.top = d, n.length === 0) break;
        let h = s.at(-1);
        if (h?.type === "code") break;
        if (h?.type === "blockquote") {
          let R = h, f = R.raw + `
` + n.join(`
`), S = this.blockquote(f);
          s[s.length - 1] = S, r = r.substring(0, r.length - R.raw.length) + S.raw, i = i.substring(0, i.length - R.text.length) + S.text;
          break;
        } else if (h?.type === "list") {
          let R = h, f = R.raw + `
` + n.join(`
`), S = this.list(f);
          s[s.length - 1] = S, r = r.substring(0, r.length - h.raw.length) + S.raw, i = i.substring(0, i.length - R.raw.length) + S.raw, n = f.substring(s.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: r, tokens: s, text: i };
    }
  }
  list(e) {
    let t = this.rules.block.list.exec(e);
    if (t) {
      let n = t[1].trim(), r = n.length > 1, i = { type: "list", raw: "", ordered: r, start: r ? +n.slice(0, -1) : "", loose: false, items: [] };
      n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r ? n : "[*+-]");
      let s = this.rules.other.listItemRegex(n), a = false;
      for (; e; ) {
        let l = false, p = "", c = "";
        if (!(t = s.exec(e)) || this.rules.block.hr.test(e)) break;
        p = t[0], e = e.substring(p.length);
        let d = ge(t[2].split(`
`, 1)[0], t[1].length), h = e.split(`
`, 1)[0], R = !d.trim(), f = 0;
        if (this.options.pedantic ? (f = 2, c = d.trimStart()) : R ? f = t[1].length + 1 : (f = d.search(this.rules.other.nonSpaceChar), f = f > 4 ? 1 : f, c = d.slice(f), f += t[1].length), R && this.rules.other.blankLine.test(h) && (p += h + `
`, e = e.substring(h.length + 1), l = true), !l) {
          let S = this.rules.other.nextBulletRegex(f), Y = this.rules.other.hrRegex(f), ee = this.rules.other.fencesBeginRegex(f), te = this.rules.other.headingBeginRegex(f), me = this.rules.other.htmlBeginRegex(f), xe = this.rules.other.blockquoteBeginRegex(f);
          for (; e; ) {
            let Z = e.split(`
`, 1)[0], A;
            if (h = Z, this.options.pedantic ? (h = h.replace(this.rules.other.listReplaceNesting, "  "), A = h) : A = h.replace(this.rules.other.tabCharGlobal, "    "), ee.test(h) || te.test(h) || me.test(h) || xe.test(h) || S.test(h) || Y.test(h)) break;
            if (A.search(this.rules.other.nonSpaceChar) >= f || !h.trim()) c += `
` + A.slice(f);
            else {
              if (R || d.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || ee.test(d) || te.test(d) || Y.test(d)) break;
              c += `
` + h;
            }
            R = !h.trim(), p += Z + `
`, e = e.substring(Z.length + 1), d = A.slice(f);
          }
        }
        i.loose || (a ? i.loose = true : this.rules.other.doubleBlankLine.test(p) && (a = true)), i.items.push({ type: "list_item", raw: p, task: !!this.options.gfm && this.rules.other.listIsTask.test(c), loose: false, text: c, tokens: [] }), i.raw += p;
      }
      let o = i.items.at(-1);
      if (o) o.raw = o.raw.trimEnd(), o.text = o.text.trimEnd();
      else return;
      i.raw = i.raw.trimEnd();
      for (let l of i.items) {
        if (this.lexer.state.top = false, l.tokens = this.lexer.blockTokens(l.text, []), l.task) {
          if (l.text = l.text.replace(this.rules.other.listReplaceTask, ""), l.tokens[0]?.type === "text" || l.tokens[0]?.type === "paragraph") {
            l.tokens[0].raw = l.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), l.tokens[0].text = l.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
            for (let c = this.lexer.inlineQueue.length - 1; c >= 0; c--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[c].src)) {
              this.lexer.inlineQueue[c].src = this.lexer.inlineQueue[c].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          }
          let p = this.rules.other.listTaskCheckbox.exec(l.raw);
          if (p) {
            let c = { type: "checkbox", raw: p[0] + " ", checked: p[0] !== "[ ]" };
            l.checked = c.checked, i.loose ? l.tokens[0] && ["paragraph", "text"].includes(l.tokens[0].type) && "tokens" in l.tokens[0] && l.tokens[0].tokens ? (l.tokens[0].raw = c.raw + l.tokens[0].raw, l.tokens[0].text = c.raw + l.tokens[0].text, l.tokens[0].tokens.unshift(c)) : l.tokens.unshift({ type: "paragraph", raw: c.raw, text: c.raw, tokens: [c] }) : l.tokens.unshift(c);
          }
        }
        if (!i.loose) {
          let p = l.tokens.filter((d) => d.type === "space"), c = p.length > 0 && p.some((d) => this.rules.other.anyLine.test(d.raw));
          i.loose = c;
        }
      }
      if (i.loose) for (let l of i.items) {
        l.loose = true;
        for (let p of l.tokens) p.type === "text" && (p.type = "paragraph");
      }
      return i;
    }
  }
  html(e) {
    let t = this.rules.block.html.exec(e);
    if (t) return { type: "html", block: true, raw: t[0], pre: t[1] === "pre" || t[1] === "script" || t[1] === "style", text: t[0] };
  }
  def(e) {
    let t = this.rules.block.def.exec(e);
    if (t) {
      let n = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
      return { type: "def", tag: n, raw: t[0], href: r, title: i };
    }
  }
  table(e) {
    let t = this.rules.block.table.exec(e);
    if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
    let n = V(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], s = { type: "table", raw: t[0], header: [], align: [], rows: [] };
    if (n.length === r.length) {
      for (let a of r) this.rules.other.tableAlignRight.test(a) ? s.align.push("right") : this.rules.other.tableAlignCenter.test(a) ? s.align.push("center") : this.rules.other.tableAlignLeft.test(a) ? s.align.push("left") : s.align.push(null);
      for (let a = 0; a < n.length; a++) s.header.push({ text: n[a], tokens: this.lexer.inline(n[a]), header: true, align: s.align[a] });
      for (let a of i) s.rows.push(V(a, s.header.length).map((o, l) => ({ text: o, tokens: this.lexer.inline(o), header: false, align: s.align[l] })));
      return s;
    }
  }
  lheading(e) {
    let t = this.rules.block.lheading.exec(e);
    if (t) {
      let n = t[1].trim();
      return { type: "heading", raw: t[0], depth: t[2].charAt(0) === "=" ? 1 : 2, text: n, tokens: this.lexer.inline(n) };
    }
  }
  paragraph(e) {
    let t = this.rules.block.paragraph.exec(e);
    if (t) {
      let n = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
      return { type: "paragraph", raw: t[0], text: n, tokens: this.lexer.inline(n) };
    }
  }
  text(e) {
    let t = this.rules.block.text.exec(e);
    if (t) return { type: "text", raw: t[0], text: t[0], tokens: this.lexer.inline(t[0]) };
  }
  escape(e) {
    let t = this.rules.inline.escape.exec(e);
    if (t) return { type: "escape", raw: t[0], text: t[1] };
  }
  tag(e) {
    let t = this.rules.inline.tag.exec(e);
    if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = true : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = false), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = true : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = false), { type: "html", raw: t[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: false, text: t[0] };
  }
  link(e) {
    let t = this.rules.inline.link.exec(e);
    if (t) {
      let n = t[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
        if (!this.rules.other.endAngleBracket.test(n)) return;
        let s = I(n.slice(0, -1), "\\");
        if ((n.length - s.length) % 2 === 0) return;
      } else {
        let s = de(t[2], "()");
        if (s === -2) return;
        if (s > -1) {
          let o = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + s;
          t[2] = t[2].substring(0, s), t[0] = t[0].substring(0, o).trim(), t[3] = "";
        }
      }
      let r = t[2], i = "";
      if (this.options.pedantic) {
        let s = this.rules.other.pedanticHrefTitle.exec(r);
        s && (r = s[1], i = s[3]);
      } else i = t[3] ? t[3].slice(1, -1) : "";
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? r = r.slice(1) : r = r.slice(1, -1)), fe(t, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: i && i.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
    }
  }
  reflink(e, t) {
    let n;
    if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
      let r = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), i = t[r.toLowerCase()];
      if (!i) {
        let s = n[0].charAt(0);
        return { type: "text", raw: s, text: s };
      }
      return fe(n, i, n[0], this.lexer, this.rules);
    }
  }
  emStrong(e, t, n = "") {
    let r = this.rules.inline.emStrongLDelim.exec(e);
    if (!r || !r[1] && !r[2] && !r[3] && !r[4] || r[4] && n.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(r[1] || r[3] || "") || !n || this.rules.inline.punctuation.exec(n)) {
      let s = [...r[0]].length - 1, a, o, l = s, p = 0, c = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (c.lastIndex = 0, t = t.slice(-1 * e.length + s); (r = c.exec(t)) != null; ) {
        if (a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !a) continue;
        if (o = [...a].length, r[3] || r[4]) {
          l += o;
          continue;
        } else if ((r[5] || r[6]) && s % 3 && !((s + o) % 3)) {
          p += o;
          continue;
        }
        if (l -= o, l > 0) continue;
        o = Math.min(o, o + l + p);
        let d = [...r[0]][0].length, h = e.slice(0, s + r.index + d + o);
        if (Math.min(s, o) % 2) {
          let f = h.slice(1, -1);
          return { type: "em", raw: h, text: f, tokens: this.lexer.inlineTokens(f) };
        }
        let R = h.slice(2, -2);
        return { type: "strong", raw: h, text: R, tokens: this.lexer.inlineTokens(R) };
      }
    }
  }
  codespan(e) {
    let t = this.rules.inline.code.exec(e);
    if (t) {
      let n = t[2].replace(this.rules.other.newLineCharGlobal, " "), r = this.rules.other.nonSpaceChar.test(n), i = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
      return r && i && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: t[0], text: n };
    }
  }
  br(e) {
    let t = this.rules.inline.br.exec(e);
    if (t) return { type: "br", raw: t[0] };
  }
  del(e, t, n = "") {
    let r = this.rules.inline.delLDelim.exec(e);
    if (!r) return;
    if (!(r[1] || "") || !n || this.rules.inline.punctuation.exec(n)) {
      let s = [...r[0]].length - 1, a, o, l = s, p = this.rules.inline.delRDelim;
      for (p.lastIndex = 0, t = t.slice(-1 * e.length + s); (r = p.exec(t)) != null; ) {
        if (a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !a || (o = [...a].length, o !== s)) continue;
        if (r[3] || r[4]) {
          l += o;
          continue;
        }
        if (l -= o, l > 0) continue;
        o = Math.min(o, o + l);
        let c = [...r[0]][0].length, d = e.slice(0, s + r.index + c + o), h = d.slice(s, -s);
        return { type: "del", raw: d, text: h, tokens: this.lexer.inlineTokens(h) };
      }
    }
  }
  autolink(e) {
    let t = this.rules.inline.autolink.exec(e);
    if (t) {
      let n, r;
      return t[2] === "@" ? (n = t[1], r = "mailto:" + n) : (n = t[1], r = n), { type: "link", raw: t[0], text: n, href: r, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  url(e) {
    let t;
    if (t = this.rules.inline.url.exec(e)) {
      let n, r;
      if (t[2] === "@") n = t[0], r = "mailto:" + n;
      else {
        let i;
        do
          i = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
        while (i !== t[0]);
        n = t[0], t[1] === "www." ? r = "http://" + t[0] : r = t[0];
      }
      return { type: "link", raw: t[0], text: n, href: r, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  inlineText(e) {
    let t = this.rules.inline.text.exec(e);
    if (t) {
      let n = this.lexer.state.inRawBlock;
      return { type: "text", raw: t[0], text: t[0], escaped: n };
    }
  }
};
var x = class u {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || T, this.options.tokenizer = this.options.tokenizer || new w(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: false, inRawBlock: false, top: true };
    let t = { other: m, block: B.normal, inline: E.normal };
    this.options.pedantic ? (t.block = B.pedantic, t.inline = E.pedantic) : this.options.gfm && (t.block = B.gfm, this.options.breaks ? t.inline = E.breaks : t.inline = E.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: B, inline: E };
  }
  static lex(e, t) {
    return new u(t).lex(e);
  }
  static lexInline(e, t) {
    return new u(t).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(m.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      let n = this.inlineQueue[t];
      this.inlineTokens(n.src, n.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], n = false) {
    for (this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(m.tabCharGlobal, "    ").replace(m.spaceLine, "")); e; ) {
      let r;
      if (this.options.extensions?.block?.some((s) => (r = s.call({ lexer: this }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), true) : false)) continue;
      if (r = this.tokenizer.space(e)) {
        e = e.substring(r.raw.length);
        let s = t.at(-1);
        r.raw.length === 1 && s !== void 0 ? s.raw += `
` : t.push(r);
        continue;
      }
      if (r = this.tokenizer.code(e)) {
        e = e.substring(r.raw.length);
        let s = t.at(-1);
        s?.type === "paragraph" || s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.at(-1).src = s.text) : t.push(r);
        continue;
      }
      if (r = this.tokenizer.fences(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.heading(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.hr(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.blockquote(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.list(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.html(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.def(e)) {
        e = e.substring(r.raw.length);
        let s = t.at(-1);
        s?.type === "paragraph" || s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.raw, this.inlineQueue.at(-1).src = s.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = { href: r.href, title: r.title }, t.push(r));
        continue;
      }
      if (r = this.tokenizer.table(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.lheading(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      let i = e;
      if (this.options.extensions?.startBlock) {
        let s = 1 / 0, a = e.slice(1), o;
        this.options.extensions.startBlock.forEach((l) => {
          o = l.call({ lexer: this }, a), typeof o == "number" && o >= 0 && (s = Math.min(s, o));
        }), s < 1 / 0 && s >= 0 && (i = e.substring(0, s + 1));
      }
      if (this.state.top && (r = this.tokenizer.paragraph(i))) {
        let s = t.at(-1);
        n && s?.type === "paragraph" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : t.push(r), n = i.length !== e.length, e = e.substring(r.raw.length);
        continue;
      }
      if (r = this.tokenizer.text(e)) {
        e = e.substring(r.raw.length);
        let s = t.at(-1);
        s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : t.push(r);
        continue;
      }
      if (e) {
        let s = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(s);
          break;
        } else throw new Error(s);
      }
    }
    return this.state.top = true, t;
  }
  inline(e, t = []) {
    return this.inlineQueue.push({ src: e, tokens: t }), t;
  }
  inlineTokens(e, t = []) {
    this.tokenizer.lexer = this;
    let n = e, r = null;
    if (this.tokens.links) {
      let o = Object.keys(this.tokens.links);
      if (o.length > 0) for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null; ) o.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null; ) n = n.slice(0, r.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let i;
    for (; (r = this.tokenizer.rules.inline.blockSkip.exec(n)) != null; ) i = r[2] ? r[2].length : 0, n = n.slice(0, r.index + i) + "[" + "a".repeat(r[0].length - i - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
    let s = false, a = "";
    for (; e; ) {
      s || (a = ""), s = false;
      let o;
      if (this.options.extensions?.inline?.some((p) => (o = p.call({ lexer: this }, e, t)) ? (e = e.substring(o.raw.length), t.push(o), true) : false)) continue;
      if (o = this.tokenizer.escape(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.tag(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.link(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(o.raw.length);
        let p = t.at(-1);
        o.type === "text" && p?.type === "text" ? (p.raw += o.raw, p.text += o.text) : t.push(o);
        continue;
      }
      if (o = this.tokenizer.emStrong(e, n, a)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.codespan(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.br(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.del(e, n, a)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.autolink(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (!this.state.inLink && (o = this.tokenizer.url(e))) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      let l = e;
      if (this.options.extensions?.startInline) {
        let p = 1 / 0, c = e.slice(1), d;
        this.options.extensions.startInline.forEach((h) => {
          d = h.call({ lexer: this }, c), typeof d == "number" && d >= 0 && (p = Math.min(p, d));
        }), p < 1 / 0 && p >= 0 && (l = e.substring(0, p + 1));
      }
      if (o = this.tokenizer.inlineText(l)) {
        e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (a = o.raw.slice(-1)), s = true;
        let p = t.at(-1);
        p?.type === "text" ? (p.raw += o.raw, p.text += o.text) : t.push(o);
        continue;
      }
      if (e) {
        let p = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(p);
          break;
        } else throw new Error(p);
      }
    }
    return t;
  }
};
var y = class {
  options;
  parser;
  constructor(e) {
    this.options = e || T;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    let r = (t || "").match(m.notSpaceStart)?.[0], i = e.replace(m.endingNewline, "") + `
`;
    return r ? '<pre><code class="language-' + O(r) + '">' + (n ? i : O(i, true)) + `</code></pre>
` : "<pre><code>" + (n ? i : O(i, true)) + `</code></pre>
`;
  }
  blockquote({ tokens: e }) {
    return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
  }
  html({ text: e }) {
    return e;
  }
  def(e) {
    return "";
  }
  heading({ tokens: e, depth: t }) {
    return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
  }
  hr(e) {
    return `<hr>
`;
  }
  list(e) {
    let t = e.ordered, n = e.start, r = "";
    for (let a = 0; a < e.items.length; a++) {
      let o = e.items[a];
      r += this.listitem(o);
    }
    let i = t ? "ol" : "ul", s = t && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + i + s + `>
` + r + "</" + i + `>
`;
  }
  listitem(e) {
    return `<li>${this.parser.parse(e.tokens)}</li>
`;
  }
  checkbox({ checked: e }) {
    return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: e }) {
    return `<p>${this.parser.parseInline(e)}</p>
`;
  }
  table(e) {
    let t = "", n = "";
    for (let i = 0; i < e.header.length; i++) n += this.tablecell(e.header[i]);
    t += this.tablerow({ text: n });
    let r = "";
    for (let i = 0; i < e.rows.length; i++) {
      let s = e.rows[i];
      n = "";
      for (let a = 0; a < s.length; a++) n += this.tablecell(s[a]);
      r += this.tablerow({ text: n });
    }
    return r && (r = `<tbody>${r}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + r + `</table>
`;
  }
  tablerow({ text: e }) {
    return `<tr>
${e}</tr>
`;
  }
  tablecell(e) {
    let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
    return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
  }
  strong({ tokens: e }) {
    return `<strong>${this.parser.parseInline(e)}</strong>`;
  }
  em({ tokens: e }) {
    return `<em>${this.parser.parseInline(e)}</em>`;
  }
  codespan({ text: e }) {
    return `<code>${O(e, true)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: n }) {
    let r = this.parser.parseInline(n), i = J(e);
    if (i === null) return r;
    e = i;
    let s = '<a href="' + e + '"';
    return t && (s += ' title="' + O(t) + '"'), s += ">" + r + "</a>", s;
  }
  image({ href: e, title: t, text: n, tokens: r }) {
    r && (n = this.parser.parseInline(r, this.parser.textRenderer));
    let i = J(e);
    if (i === null) return O(n);
    e = i;
    let s = `<img src="${e}" alt="${O(n)}"`;
    return t && (s += ` title="${O(t)}"`), s += ">", s;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : O(e.text);
  }
};
var $ = class {
  strong({ text: e }) {
    return e;
  }
  em({ text: e }) {
    return e;
  }
  codespan({ text: e }) {
    return e;
  }
  del({ text: e }) {
    return e;
  }
  html({ text: e }) {
    return e;
  }
  text({ text: e }) {
    return e;
  }
  link({ text: e }) {
    return "" + e;
  }
  image({ text: e }) {
    return "" + e;
  }
  br() {
    return "";
  }
  checkbox({ raw: e }) {
    return e;
  }
};
var b = class u2 {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || T, this.options.renderer = this.options.renderer || new y(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new $();
  }
  static parse(e, t) {
    return new u2(t).parse(e);
  }
  static parseInline(e, t) {
    return new u2(t).parseInline(e);
  }
  parse(e) {
    this.renderer.parser = this;
    let t = "";
    for (let n = 0; n < e.length; n++) {
      let r = e[n];
      if (this.options.extensions?.renderers?.[r.type]) {
        let s = r, a = this.options.extensions.renderers[s.type].call({ parser: this }, s);
        if (a !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(s.type)) {
          t += a || "";
          continue;
        }
      }
      let i = r;
      switch (i.type) {
        case "space": {
          t += this.renderer.space(i);
          break;
        }
        case "hr": {
          t += this.renderer.hr(i);
          break;
        }
        case "heading": {
          t += this.renderer.heading(i);
          break;
        }
        case "code": {
          t += this.renderer.code(i);
          break;
        }
        case "table": {
          t += this.renderer.table(i);
          break;
        }
        case "blockquote": {
          t += this.renderer.blockquote(i);
          break;
        }
        case "list": {
          t += this.renderer.list(i);
          break;
        }
        case "checkbox": {
          t += this.renderer.checkbox(i);
          break;
        }
        case "html": {
          t += this.renderer.html(i);
          break;
        }
        case "def": {
          t += this.renderer.def(i);
          break;
        }
        case "paragraph": {
          t += this.renderer.paragraph(i);
          break;
        }
        case "text": {
          t += this.renderer.text(i);
          break;
        }
        default: {
          let s = 'Token with "' + i.type + '" type was not found.';
          if (this.options.silent) return console.error(s), "";
          throw new Error(s);
        }
      }
    }
    return t;
  }
  parseInline(e, t = this.renderer) {
    this.renderer.parser = this;
    let n = "";
    for (let r = 0; r < e.length; r++) {
      let i = e[r];
      if (this.options.extensions?.renderers?.[i.type]) {
        let a = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (a !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
          n += a || "";
          continue;
        }
      }
      let s = i;
      switch (s.type) {
        case "escape": {
          n += t.text(s);
          break;
        }
        case "html": {
          n += t.html(s);
          break;
        }
        case "link": {
          n += t.link(s);
          break;
        }
        case "image": {
          n += t.image(s);
          break;
        }
        case "checkbox": {
          n += t.checkbox(s);
          break;
        }
        case "strong": {
          n += t.strong(s);
          break;
        }
        case "em": {
          n += t.em(s);
          break;
        }
        case "codespan": {
          n += t.codespan(s);
          break;
        }
        case "br": {
          n += t.br(s);
          break;
        }
        case "del": {
          n += t.del(s);
          break;
        }
        case "text": {
          n += t.text(s);
          break;
        }
        default: {
          let a = 'Token with "' + s.type + '" type was not found.';
          if (this.options.silent) return console.error(a), "";
          throw new Error(a);
        }
      }
    }
    return n;
  }
};
var P = class {
  options;
  block;
  constructor(e) {
    this.options = e || T;
  }
  static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
  static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
  preprocess(e) {
    return e;
  }
  postprocess(e) {
    return e;
  }
  processAllTokens(e) {
    return e;
  }
  emStrongMask(e) {
    return e;
  }
  provideLexer() {
    return this.block ? x.lex : x.lexInline;
  }
  provideParser() {
    return this.block ? b.parse : b.parseInline;
  }
};
var D = class {
  defaults = M();
  options = this.setOptions;
  parse = this.parseMarkdown(true);
  parseInline = this.parseMarkdown(false);
  Parser = b;
  Renderer = y;
  TextRenderer = $;
  Lexer = x;
  Tokenizer = w;
  Hooks = P;
  constructor(...e) {
    this.use(...e);
  }
  walkTokens(e, t) {
    let n = [];
    for (let r of e) switch (n = n.concat(t.call(this, r)), r.type) {
      case "table": {
        let i = r;
        for (let s of i.header) n = n.concat(this.walkTokens(s.tokens, t));
        for (let s of i.rows) for (let a of s) n = n.concat(this.walkTokens(a.tokens, t));
        break;
      }
      case "list": {
        let i = r;
        n = n.concat(this.walkTokens(i.items, t));
        break;
      }
      default: {
        let i = r;
        this.defaults.extensions?.childTokens?.[i.type] ? this.defaults.extensions.childTokens[i.type].forEach((s) => {
          let a = i[s].flat(1 / 0);
          n = n.concat(this.walkTokens(a, t));
        }) : i.tokens && (n = n.concat(this.walkTokens(i.tokens, t)));
      }
    }
    return n;
  }
  use(...e) {
    let t = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return e.forEach((n) => {
      let r = { ...n };
      if (r.async = this.defaults.async || r.async || false, n.extensions && (n.extensions.forEach((i) => {
        if (!i.name) throw new Error("extension name required");
        if ("renderer" in i) {
          let s = t.renderers[i.name];
          s ? t.renderers[i.name] = function(...a) {
            let o = i.renderer.apply(this, a);
            return o === false && (o = s.apply(this, a)), o;
          } : t.renderers[i.name] = i.renderer;
        }
        if ("tokenizer" in i) {
          if (!i.level || i.level !== "block" && i.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let s = t[i.level];
          s ? s.unshift(i.tokenizer) : t[i.level] = [i.tokenizer], i.start && (i.level === "block" ? t.startBlock ? t.startBlock.push(i.start) : t.startBlock = [i.start] : i.level === "inline" && (t.startInline ? t.startInline.push(i.start) : t.startInline = [i.start]));
        }
        "childTokens" in i && i.childTokens && (t.childTokens[i.name] = i.childTokens);
      }), r.extensions = t), n.renderer) {
        let i = this.defaults.renderer || new y(this.defaults);
        for (let s in n.renderer) {
          if (!(s in i)) throw new Error(`renderer '${s}' does not exist`);
          if (["options", "parser"].includes(s)) continue;
          let a = s, o = n.renderer[a], l = i[a];
          i[a] = (...p) => {
            let c = o.apply(i, p);
            return c === false && (c = l.apply(i, p)), c || "";
          };
        }
        r.renderer = i;
      }
      if (n.tokenizer) {
        let i = this.defaults.tokenizer || new w(this.defaults);
        for (let s in n.tokenizer) {
          if (!(s in i)) throw new Error(`tokenizer '${s}' does not exist`);
          if (["options", "rules", "lexer"].includes(s)) continue;
          let a = s, o = n.tokenizer[a], l = i[a];
          i[a] = (...p) => {
            let c = o.apply(i, p);
            return c === false && (c = l.apply(i, p)), c;
          };
        }
        r.tokenizer = i;
      }
      if (n.hooks) {
        let i = this.defaults.hooks || new P();
        for (let s in n.hooks) {
          if (!(s in i)) throw new Error(`hook '${s}' does not exist`);
          if (["options", "block"].includes(s)) continue;
          let a = s, o = n.hooks[a], l = i[a];
          P.passThroughHooks.has(s) ? i[a] = (p) => {
            if (this.defaults.async && P.passThroughHooksRespectAsync.has(s)) return (async () => {
              let d = await o.call(i, p);
              return l.call(i, d);
            })();
            let c = o.call(i, p);
            return l.call(i, c);
          } : i[a] = (...p) => {
            if (this.defaults.async) return (async () => {
              let d = await o.apply(i, p);
              return d === false && (d = await l.apply(i, p)), d;
            })();
            let c = o.apply(i, p);
            return c === false && (c = l.apply(i, p)), c;
          };
        }
        r.hooks = i;
      }
      if (n.walkTokens) {
        let i = this.defaults.walkTokens, s = n.walkTokens;
        r.walkTokens = function(a) {
          let o = [];
          return o.push(s.call(this, a)), i && (o = o.concat(i.call(this, a))), o;
        };
      }
      this.defaults = { ...this.defaults, ...r };
    }), this;
  }
  setOptions(e) {
    return this.defaults = { ...this.defaults, ...e }, this;
  }
  lexer(e, t) {
    return x.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return b.parse(e, t ?? this.defaults);
  }
  parseMarkdown(e) {
    return (n, r) => {
      let i = { ...r }, s = { ...this.defaults, ...i }, a = this.onError(!!s.silent, !!s.async);
      if (this.defaults.async === true && i.async === false) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof n > "u" || n === null) return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof n != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
      if (s.hooks && (s.hooks.options = s, s.hooks.block = e), s.async) return (async () => {
        let o = s.hooks ? await s.hooks.preprocess(n) : n, p = await (s.hooks ? await s.hooks.provideLexer() : e ? x.lex : x.lexInline)(o, s), c = s.hooks ? await s.hooks.processAllTokens(p) : p;
        s.walkTokens && await Promise.all(this.walkTokens(c, s.walkTokens));
        let h = await (s.hooks ? await s.hooks.provideParser() : e ? b.parse : b.parseInline)(c, s);
        return s.hooks ? await s.hooks.postprocess(h) : h;
      })().catch(a);
      try {
        s.hooks && (n = s.hooks.preprocess(n));
        let l = (s.hooks ? s.hooks.provideLexer() : e ? x.lex : x.lexInline)(n, s);
        s.hooks && (l = s.hooks.processAllTokens(l)), s.walkTokens && this.walkTokens(l, s.walkTokens);
        let c = (s.hooks ? s.hooks.provideParser() : e ? b.parse : b.parseInline)(l, s);
        return s.hooks && (c = s.hooks.postprocess(c)), c;
      } catch (o) {
        return a(o);
      }
    };
  }
  onError(e, t) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
        let r = "<p>An error occurred:</p><pre>" + O(n.message + "", true) + "</pre>";
        return t ? Promise.resolve(r) : r;
      }
      if (t) return Promise.reject(n);
      throw n;
    };
  }
};
var L = new D();
function g(u3, e) {
  return L.parse(u3, e);
}
g.options = g.setOptions = function(u3) {
  return L.setOptions(u3), g.defaults = L.defaults, G(g.defaults), g;
};
g.getDefaults = M;
g.defaults = T;
g.use = function(...u3) {
  return L.use(...u3), g.defaults = L.defaults, G(g.defaults), g;
};
g.walkTokens = function(u3, e) {
  return L.walkTokens(u3, e);
};
g.parseInline = L.parseInline;
g.Parser = b;
g.parser = b.parse;
g.Renderer = y;
g.TextRenderer = $;
g.Lexer = x;
g.lexer = x.lex;
g.Tokenizer = w;
g.Hooks = P;
g.parse = g;
var Qt = g.options;
var jt = g.setOptions;
var Ft = g.use;
var Ut = g.walkTokens;
var Kt = g.parseInline;
var Xt = b.parse;
var Jt = x.lex;

// src/evidence.js
var MAX_REPORT_BYTES = 256 * 1024;
var mutationNames = /* @__PURE__ */ new Set(["write", "edit"]);
var isMutation = (name2) => mutationNames.has(name2);
var terminalFailures = /* @__PURE__ */ new Set(["aborted", "blocked", "error", "max-tokens", "interrupted"]);
function validInstant(value) {
  return typeof value === "string" && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
}
function localDate(instant, timeZone) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone,
    calendar: "gregory",
    numberingSystem: "latn",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date(instant));
  return ["year", "month", "day"].map((type) => parts.find((part) => part.type === type).value).join("-");
}
function relativePath(value) {
  if (typeof value !== "string" || value.length > 400) return null;
  const path = value.trim().replaceAll("\\", "/");
  if (!path || /[:*?"<>|\x00-\x1f]/u.test(path)) return null;
  const parts = path.replaceAll("{date}", "2000-01-01").split("/");
  if (parts.some((part) => !part || part === "." || part === ".." || /^~|[ .]$|[{}]/u.test(part) || /^(?:con|prn|aux|nul|com[1-9¹²³]|lpt[1-9¹²³])(?:\.|$)/iu.test(part))) return null;
  return path;
}
function occurrencePath(rule, at, timeZone) {
  return rule?.path?.replaceAll("{date}", localDate(at, timeZone)) ?? null;
}
function reminder(message) {
  if (message?.source?.kind !== "schedule" || message.content?.length !== 1 || message.content[0].type !== "text") return null;
  const lines = message.content[0].text.split("\n");
  if (lines[0] !== "[SCHEDULE REMINDER]" || lines[1] !== "This is a scheduled message from the user" || lines.length !== 5 || !lines[2].startsWith("schedule_id_json: ") || !lines[3].startsWith("occurrence_at: ") || !lines[4].startsWith("reminder_prompt_json: ")) return null;
  try {
    const taskId = JSON.parse(lines[2].slice(18));
    const at = lines[3].slice(15);
    const prompt = JSON.parse(lines[4].slice(22));
    return typeof taskId === "string" && validInstant(at) && typeof prompt === "string" ? { taskId, at, prompt } : null;
  } catch {
    return null;
  }
}
function associate(snapshot, row) {
  if (snapshot.session.id !== row.receipt.targetSessionId || snapshot.session.isSeeded || snapshot.inheritedEventCount !== 0) {
    return { status: "unknown", reason: "ambiguous" };
  }
  const matches = snapshot.events.filter((event) => event.type === "user/message" && event.data.id === row.receipt.messageId);
  if (matches.length === 0) return { status: "pending", reason: "noAcceptance" };
  if (matches.length !== 1) return { status: "unknown", reason: "ambiguous" };
  const accepted = matches[0];
  const payload = reminder(accepted.data);
  if (payload?.taskId !== row.taskId || payload.at !== row.at || row.receipt.prompt !== void 0 && payload.prompt !== row.receipt.prompt) {
    return { status: "unknown", reason: "ambiguous" };
  }
  const starts = snapshot.events.filter((event) => event.type === "turn/start");
  const start = starts[0];
  const next = starts[1]?.seq ?? Infinity;
  if (!start || start.data.turn !== 1 || accepted.seq <= start.seq || accepted.seq >= next) {
    return { status: "unknown", reason: "ambiguous" };
  }
  const logs = snapshot.events.filter((event) => event.seq >= start.seq && event.seq < next);
  const outcomes = logs.filter((event) => event.type === "turn/end");
  const end = outcomes[0];
  if (outcomes.length > 1 || end && (end.data.turn !== 1 || end.seq <= accepted.seq) || logs.some((event) => event.type === "user/message" && event !== accepted && (event.data.source?.kind === "user" || reminder(event.data) || event.data.content?.[0]?.text?.startsWith?.("[SCHEDULE REMINDER BATCH]")))) {
    return { status: "unknown", reason: "ambiguous" };
  }
  const identity = { turn: 1, startSeq: start.seq, messageSeq: accepted.seq };
  if (!end) return { ...identity, status: "running" };
  const kind = end.data.reason?.kind;
  const status = kind === "completed" ? "completed" : terminalFailures.has(kind) ? "failed" : "unknown";
  return { ...identity, status, reason: kind, endSeq: end.seq, endedAt: end.time };
}
function confirmedMutation(event, observation) {
  if (!observation || event.data.message?.isError !== false || event.data.meta?.path !== observation.path) return false;
  const meta = event.data.meta;
  return observation.name === "write" && meta.operation === "create" || Array.isArray(meta.diffs) && meta.diffs.some((diff) => diff.path === observation.path && diff.oldText !== diff.newText);
}
function headingResults(markdown, headings) {
  const found = /* @__PURE__ */ new Set();
  const text = (token) => {
    if (token.type === "image" || token.type === "html") return "";
    if (token.type === "codespan") return token.text;
    if (token.tokens) return token.tokens.map(text).join("");
    return token.text ?? "";
  };
  for (const token of Jt(markdown)) {
    if (token.type === "heading") found.add(normalizeHeading(text(token)));
  }
  return headings.map((heading) => ({ heading, pass: found.has(normalizeHeading(heading)) }));
}
function normalizeHeading(value) {
  return value.trim().replace(/\s+/gu, " ").normalize("NFC");
}
function auditFile({ file, baseline, write, headings }) {
  if (file.state === "missing") return { status: "rejected", reason: "missing" };
  if (file.state !== "present") return { status: "unknown", reason: file.state };
  const evidence = { version: file.version, absolutePath: file.absolutePath, bytes: file.bytes };
  if (!write || file.version !== write.version || file.absolutePath !== write.path) {
    if (write) return { ...evidence, status: "unknown", reason: "changedAfterWrite", write };
    if (baseline?.version === file.version && baseline.absolutePath === file.absolutePath) {
      return { ...evidence, status: "rejected", reason: "stale", baseline };
    }
    return { ...evidence, status: "unknown", reason: baseline ? "unattributedChange" : "unattributed", baseline };
  }
  if (headings.length && file.markdown === void 0) return { ...evidence, status: "unknown", reason: file.readError, write };
  const checks = headingResults(file.markdown ?? "", headings);
  return {
    ...evidence,
    status: checks.every((item) => item.pass) ? "passed" : "rejected",
    reason: checks.every((item) => item.pass) ? "verified" : "headingsMissing",
    write,
    checks
  };
}

// src/files.js
async function workspaceFile(fs, root, path, { text = false, signal } = {}) {
  if (!root || relativePath(path) !== path) return { state: "outsideWorkspace" };
  try {
    const parent = await fs.resolve(root, { signal });
    const target = await fs.resolve(path, { cwd: root, signal });
    const absolutePath = fs.processPath(target);
    if (!fs.contains(parent, target) || parent.targetKey === target.targetKey) return { state: "outsideWorkspace" };
    const entry = await fs.lstat(path, { cwd: root }, signal);
    if (!entry) return { state: "missing" };
    if (entry.type !== "file") return { state: "notFile" };
    const info = await fs.stat(target, signal);
    if (!info) return { state: "missing" };
    if (info.type !== "file" || info.version !== entry.version) return { state: "unstable" };
    const file = { state: "present", absolutePath, version: info.version, bytes: info.size };
    if (!text) return file;
    if (info.size !== void 0 && info.size > MAX_REPORT_BYTES) return { ...file, readError: "tooLarge" };
    const bytes = await fs.readBytes(target, signal, MAX_REPORT_BYTES);
    const after = await fs.stat(target, signal);
    const entryAfter = await fs.lstat(path, { cwd: root }, signal);
    if (after?.version !== info.version || entryAfter?.version !== info.version) return { state: "unstable" };
    try {
      const markdown = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      return markdown.includes("\0") ? { ...file, readError: "notText" } : { ...file, markdown };
    } catch {
      return { ...file, readError: "notText" };
    }
  } catch (error2) {
    if (signal?.aborted) throw error2;
    return { state: "fileUnavailable" };
  }
}

// src/monitor.js
var SAMPLE_MS = 15e3;
var MAX_GAP_MS = 45e3;
var DELIVERY_GRACE_MS = 9e4;
var HOUR_MS = 36e5;
var historyLimit = 30;
var historyPages = 10;
var iso = (value) => new Date(value).toISOString();
var keyFor = (taskId, at, messageId = "") => JSON.stringify([taskId, at, messageId]);
var time = (value) => Date.parse(value);
var since = (watch) => watch.revisions.at(-1).from;
var currentRule = (watch) => watch?.revisions.at(-1);
var sameRoot = (a, b2) => typeof a === "string" && typeof b2 === "string" && isAbsolute(a) && isAbsolute(b2) && relative(a, b2) === "";
var error = (code) => Object.assign(new Error(code), { publicCode: code });
function advanceWindow(previous, task, revision, now) {
  if (task.status !== "active" || !validInstant(task.at) || task.floorAt && task.floorAt > task.at) return void 0;
  const signature = JSON.stringify([task.at, task.updatedAt, task.zone, task.root, revision.from]);
  if (previous?.signature === signature && now >= previous.last && now - previous.last <= MAX_GAP_MS) {
    return { ...previous, last: now };
  }
  if (time(task.at) > now) return { signature, at: task.at, first: now, last: now };
}
function observedMissing(window, page, now) {
  if (!window || now - time(window.at) < DELIVERY_GRACE_MS || page.records.some((record) => record.scheduledAt === window.at)) return false;
  const coversStart = page.records.some((record) => time(record.deliveredAt) <= window.first);
  return coversStart || !page.nextBefore && !page.earlierRecordsUnavailable && !page.earlierRecordsPruned;
}
function createMonitor(ctx, ledger, { now = Date.now } = {}) {
  let catalog = [];
  let failure = null;
  let checkedAt = null;
  let queue = Promise.resolve();
  let stopping = false;
  let windows = /* @__PURE__ */ new Map();
  const candidates = /* @__PURE__ */ new Map();
  const observed = /* @__PURE__ */ new WeakMap();
  const abort = new AbortController();
  function transact(fn) {
    const result = queue.then(() => {
      if (stopping) throw error("unavailable");
      return fn();
    });
    queue = result.catch(() => {
    });
    return result;
  }
  function plan(entry) {
    const rruleZone = entry.kind === "rrule" ? /^DTSTART;TZID=([^:]+):/u.exec(entry.rrule)?.[1] : void 0;
    return {
      id: entry.id,
      title: entry.title,
      at: entry.scheduledAt,
      updatedAt: entry.updatedAt,
      status: entry.status,
      mode: entry.target.kind,
      zone: entry.timeZone ?? rruleZone ?? "UTC",
      floorAt: entry.deliveryFloorEndsAt,
      root: entry.target.kind === "new" ? entry.target.create.cwd ?? process.cwd() : null
    };
  }
  function ruleFor(task, watch, at) {
    const revision = watch.revisions.findLast((item) => item.from <= at);
    if (!revision || !revision.on) return null;
    return { ...revision, path: occurrencePath(revision, at, revision.zone) };
  }
  function view() {
    const state = ledger.state;
    const pending = Array.from(windows, ([taskId, window]) => {
      const task = catalog.find((item) => item.id === taskId);
      if (!task || !state.watches[taskId]?.on) return null;
      const key = keyFor(taskId, window.at);
      if (state.rows[key] || Object.values(state.rows).some((row) => row.taskId === taskId && row.at === window.at)) return null;
      return {
        key,
        taskId,
        title: task.title,
        at: window.at,
        zone: task.zone,
        expectation: "waiting",
        observation: { first: iso(window.first), last: iso(window.last) },
        rule: ruleFor(task, state.watches[taskId], window.at)
      };
    }).filter(Boolean);
    const rows = [...Object.values(state.rows), ...pending].sort((a, b2) => b2.at.localeCompare(a.at));
    return {
      failure,
      checkedAt,
      rows,
      plans: catalog.map((task) => ({ ...task, watch: currentRule(state.watches[task.id]) ?? null }))
    };
  }
  async function sample({ refreshCatalog = false } = {}) {
    const state = ledger.state;
    if (!refreshCatalog && !Object.values(state.watches).some((watch) => watch.on)) return;
    const sampledAt = now();
    let nextCatalog;
    try {
      nextCatalog = (await ctx.schedule.catalog()).map(plan);
    } catch {
      windows.clear();
      failure = "catalogUnavailable";
      return;
    }
    abort.signal.throwIfAborted();
    catalog = nextCatalog;
    const next = { ...state, rows: { ...state.rows }, cursors: { ...state.cursors } };
    const nextWindows = /* @__PURE__ */ new Map();
    let degraded = false;
    for (const task of catalog) {
      const watch = state.watches[task.id];
      if (!watch?.on) continue;
      try {
        const page = await ctx.schedule.history({ id: task.id, limit: historyLimit });
        if (!Array.isArray(page.records)) throw error("historyUnavailable");
        const previous = windows.get(task.id);
        const extended = task.mode === "new" ? advanceWindow(previous, task, currentRule(watch), sampledAt) : void 0;
        const seen = previous?.at === task.at ? previous : extended;
        let cursor = page;
        const visited = /* @__PURE__ */ new Set();
        for (let i = 0; i < historyPages; i += 1) {
          let checkpointSeen = false;
          for (const record of cursor.records) {
            if (!validInstant(record.scheduledAt) || !validInstant(record.deliveredAt) || typeof record.messageId !== "string" || typeof record.targetSessionId !== "string") continue;
            const key = keyFor(task.id, record.scheduledAt, record.messageId);
            if (state.cursors?.[task.id] === key) checkpointSeen = true;
            if (next.rows[key]) continue;
            const waitingKey = keyFor(task.id, record.scheduledAt);
            const expected = next.rows[waitingKey];
            const matchingWindow = previous?.at === record.scheduledAt ? previous : null;
            const rule = expected?.rule ?? ruleFor(task, watch, record.scheduledAt);
            const { prompt, ...receipt } = record;
            next.rows[key] = {
              key,
              taskId: task.id,
              at: record.scheduledAt,
              title: expected?.title ?? task.title,
              zone: expected?.zone ?? task.zone,
              mode: task.mode,
              receipt,
              rule,
              baseline: expected?.baseline ?? (matchingWindow?.baselineRule === rule?.from ? matchingWindow?.baseline : void 0),
              scopeChanged: Boolean(rule?.path && (!sameRoot(rule.root, task.root) || rule.zone !== task.zone)),
              ...expected?.observation ? { observation: expected.observation } : {},
              ...expected?.manual ? { manual: expected.manual } : {}
            };
            if (expected) delete next.rows[waitingKey];
          }
          if (checkpointSeen || !cursor.nextBefore || i === 0 && cursor.records.at(-1)?.deliveredAt < watch.revisions[0].from) {
            const newest = page.records[0];
            if (newest) next.cursors[task.id] = keyFor(task.id, newest.scheduledAt, newest.messageId);
            break;
          }
          if (i === historyPages - 1 || visited.has(cursor.nextBefore)) {
            degraded = true;
            break;
          }
          visited.add(cursor.nextBefore);
          cursor = await ctx.schedule.history({ id: task.id, limit: historyLimit, before: cursor.nextBefore });
          if (!Array.isArray(cursor.records)) throw error("historyUnavailable");
        }
        if (extended) {
          const revision = currentRule(watch);
          if (extended.first === sampledAt && sameRoot(revision.root, task.root) && revision.zone === task.zone && revision.path) {
            const path = occurrencePath(revision, task.at, revision.zone);
            const baseline = await workspaceFile(ctx.fs, revision.root, path, { signal: abort.signal });
            if (now() < time(task.at) && (baseline.state === "present" || baseline.state === "missing")) {
              extended.baseline = { ...baseline, checkedAt: iso(now()) };
              extended.baselineRule = revision.from;
            }
          }
          if (!page.records.some((record) => record.scheduledAt === task.at)) nextWindows.set(task.id, extended);
          if (observedMissing(extended, page, sampledAt)) {
            const key = keyFor(task.id, task.at);
            next.rows[key] ??= {
              key,
              taskId: task.id,
              at: task.at,
              title: task.title,
              zone: task.zone,
              mode: task.mode,
              expectation: "missing",
              rule: ruleFor(task, watch, task.at),
              baseline: seen?.baseline,
              observation: { first: iso(extended.first), last: iso(extended.last) }
            };
          }
        }
      } catch {
        abort.signal.throwIfAborted();
        degraded = true;
      }
    }
    const shared = /* @__PURE__ */ new Map();
    for (const row of Object.values(next.rows)) {
      if (!row.receipt) continue;
      const id = JSON.stringify([row.receipt.targetSessionId, row.receipt.messageId]);
      shared.set(id, (shared.get(id) ?? 0) + 1);
    }
    const outstanding = Object.values(next.rows).filter((row) => row.receipt && !row.final && next.watches[row.taskId]?.on).sort((a, b2) => (a.lastAttempt ?? 0) - (b2.lastAttempt ?? 0) || b2.at.localeCompare(a.at));
    for (const row of outstanding.slice(0, 20)) {
      const id = JSON.stringify([row.receipt.targetSessionId, row.receipt.messageId]);
      const result = await inspect(row, shared.get(id) > 1, sampledAt);
      next.rows[row.key] = { ...row, ...result, lastAttempt: sampledAt };
    }
    abort.signal.throwIfAborted();
    next.proofs = { ...ledger.state.proofs };
    for (const [key, proof] of Object.entries(next.proofs)) {
      if (next.rows[key]?.final || sampledAt - proof.capturedAt > 24 * HOUR_MS) delete next.proofs[key];
    }
    ledger.save(next);
    windows = nextWindows;
    checkedAt = iso(sampledAt);
    failure = degraded ? "historyUnavailable" : null;
    for (const [id, candidate] of candidates) {
      if (sampledAt - candidate.startedAt > 24 * HOUR_MS) candidates.delete(id);
    }
  }
  async function inspect(row, shared, sampledAt) {
    if (shared) return { execution: { status: "unknown", reason: "ambiguous" }, final: true };
    if (row.mode !== "new") return { execution: { status: "unknown", reason: "modeUnsupported" }, final: true };
    const old = sampledAt - time(row.receipt.deliveredAt) > 24 * HOUR_MS;
    let snapshot;
    try {
      snapshot = await ctx.sessionQuery.readSession(row.receipt.targetSessionId);
    } catch {
      return { execution: { ...row.execution, status: "unknown", reason: "sessionUnavailable" }, final: old };
    }
    const execution = associate(snapshot, row);
    if (!execution.endSeq) {
      const final = execution.reason === "ambiguous" || old;
      if (final && (execution.status === "pending" || execution.status === "running")) {
        return { execution: { ...execution, status: "unknown", reason: execution.reason ?? "noTerminal" }, final: true };
      }
      return { execution, final };
    }
    const rule = row.rule;
    if (execution.status !== "completed" || !rule?.path) return { execution, final: true };
    const checkedAt2 = iso(now());
    if (row.scopeChanged || !sameRoot(rule.root, snapshot.session.cwd) || !sameRoot(rule.root, currentRule(ledger.state.watches[row.taskId])?.root) || currentRule(ledger.state.watches[row.taskId])?.from !== rule.from) {
      return { execution, artifact: { status: "unknown", reason: "scopeChanged", checkedAt: checkedAt2 }, final: true };
    }
    const proof = ledger.state.proofs[row.key];
    const owned = proof?.revision === rule.from && proof.messageSeq === execution.messageSeq && proof.resultSeq > execution.messageSeq && proof.resultSeq < execution.endSeq && snapshot.events.some((event) => event.type === "tool/result" && event.seq === proof.resultSeq && event.data.turn === execution.turn && event.data.message?.toolCallId === proof.callId && confirmedMutation(event, proof));
    const file = await workspaceFile(ctx.fs, rule.root, rule.path, { signal: abort.signal });
    let fileForAudit = file;
    if (rule.headings.length && owned && file.state === "present" && file.version === proof.version && file.absolutePath === proof.path) {
      fileForAudit = await workspaceFile(ctx.fs, rule.root, rule.path, { text: true, signal: abort.signal });
    }
    const write = owned ? { path: proof.path, version: proof.version, resultSeq: proof.resultSeq, at: proof.at } : void 0;
    const artifact = { ...auditFile({ file: fileForAudit, baseline: row.baseline, write, headings: rule.headings }), checkedAt: checkedAt2 };
    return { execution, artifact, final: true };
  }
  function onSessionEvent(session, event) {
    if (stopping) return;
    if (event.type === "user/message" && !candidates.has(session.id)) {
      const payload = reminder(event.data);
      if (!payload) return;
      const task = catalog.find((item) => item.id === payload.taskId && item.mode === "new");
      const watch = task && ledger.state.watches[task.id];
      if (!watch?.on || since(watch) > payload.at || session.header.isSeeded) return;
      const rule = ruleFor(task, watch, payload.at);
      if (!rule?.path || rule.zone !== task.zone || !sameRoot(rule.root, task.root) || !sameRoot(rule.root, session.header.cwd)) return;
      candidates.set(session.id, {
        key: keyFor(task.id, payload.at, event.data.id),
        rule,
        taskId: task.id,
        startedAt: now(),
        messageSeq: event.seq,
        calls: /* @__PURE__ */ new Map()
      });
      return;
    }
    const candidate = candidates.get(session.id);
    if (!candidate) return;
    if (event.type === "turn/end") {
      candidates.delete(session.id);
      return true;
    }
    if (event.type === "tool/call" && isMutation(event.data.name) && event.data.turn === 1) {
      candidate.calls.set(event.data.callId, event.seq);
      return;
    }
    if (event.type !== "tool/result" || event.data.turn !== 1) return;
    const callId = event.data.message?.toolCallId;
    const call = candidate.calls.get(callId);
    const proof = observed.get(session)?.get(callId);
    candidate.calls.delete(callId);
    observed.get(session)?.delete(callId);
    if (!ledger.state.watches[candidate.taskId]?.on || currentRule(ledger.state.watches[candidate.taskId])?.from !== candidate.rule.from || call === void 0 || call <= candidate.messageSeq || !event.sourceEventSeqs?.includes(call) || !confirmedMutation(event, proof)) return;
    const state = ledger.state;
    ledger.save({ ...state, proofs: { ...state.proofs, [candidate.key]: {
      ...proof,
      callId,
      revision: candidate.rule.from,
      messageSeq: candidate.messageSeq,
      resultSeq: event.seq,
      at: iso(event.time),
      capturedAt: now()
    } } });
  }
  function onObserved(target, observation, actor) {
    if (stopping || observation.kind !== "present" || !isMutation(actor?.name)) return;
    const session = actor.agent?.session;
    const candidate = session && candidates.get(session.id);
    if (!candidate || !candidate.calls.has(actor.callId)) return;
    const rule = currentRule(ledger.state.watches[candidate.taskId]);
    if (!rule?.on || rule.from !== candidate.rule.from) return;
    const path = ctx.fs.processPath(target);
    if (!sameRoot(path, resolve(candidate.rule.root, candidate.rule.path))) return;
    let calls = observed.get(session);
    if (!calls) {
      calls = /* @__PURE__ */ new Map();
      observed.set(session, calls);
    }
    calls.set(actor.callId, { path, version: observation.version, name: actor.name });
  }
  function setWatch(payload) {
    return transact(async () => {
      if (typeof payload.id !== "string" || typeof payload.on !== "boolean") throw error("invalidPlan");
      const entries = (await ctx.schedule.catalog()).map(plan);
      abort.signal.throwIfAborted();
      const task = entries.find((entry) => entry.id === payload.id);
      if (!task || payload.on && task.mode !== "new") throw error("invalidPlan");
      if (typeof payload.path !== "string" || !Array.isArray(payload.headings)) throw error("invalidRule");
      const path = payload.path.trim() ? relativePath(payload.path) : null;
      const headings = [...new Set(payload.headings.map((heading) => typeof heading === "string" ? heading.trim() : ""))];
      if (payload.path.trim() && !path || headings.length > 12 || headings.some((heading) => !heading || heading.length > 160) || headings.length && !/\.(?:md|markdown)$/iu.test(path ?? "")) throw error("invalidRule");
      if (payload.on && path && (!task.root || !isAbsolute(task.root))) throw error("outsideWorkspace");
      const state = ledger.state;
      const before = state.watches[task.id];
      const desired = { on: payload.on, path, headings, root: task.root, zone: task.zone };
      const { from, ...previous } = currentRule(before) ?? {};
      if (JSON.stringify(previous) !== JSON.stringify(desired)) {
        const revision = { ...desired, from: iso(Math.max(now(), time(from) + 1 || 0)) };
        ledger.save({ ...state, watches: { ...state.watches, [task.id]: { on: payload.on, revisions: [...before?.revisions ?? [], revision] } } });
        windows.delete(task.id);
      }
      await sample({ refreshCatalog: true });
      return view();
    });
  }
  function mark(payload) {
    return transact(() => {
      const state = ledger.state;
      const row = typeof payload.key === "string" && Object.hasOwn(state.rows, payload.key) && state.rows[payload.key];
      if (!row || !["read", "empty", "unread"].includes(payload.action) || payload.action === "empty" && row.execution?.status !== "completed") throw error("invalidRun");
      const manual = { ...row.manual, readAt: payload.action === "unread" ? null : iso(now()) };
      if (payload.action === "empty") manual.emptyAt = iso(now());
      if (payload.action === "unread") manual.emptyAt = null;
      ledger.save({ ...state, rows: { ...state.rows, [row.key]: { ...row, manual } } });
      return view();
    });
  }
  function current(payload, signal) {
    return transact(async () => {
      const row = typeof payload.key === "string" && Object.hasOwn(ledger.state.rows, payload.key) && ledger.state.rows[payload.key];
      if (!row?.rule?.path || !row.receipt || !row.execution?.turn) throw error("invalidRun");
      const snapshot = await ctx.sessionQuery.readSession(row.receipt.targetSessionId);
      if (!sameRoot(row.rule.root, snapshot.session.cwd)) return { state: "scopeChanged" };
      return workspaceFile(ctx.fs, row.rule.root, row.rule.path, { signal: AbortSignal.any([signal, abort.signal]) });
    });
  }
  return {
    view,
    setWatch,
    mark,
    current,
    onSessionEvent,
    onObserved,
    refresh: (options) => transact(async () => {
      await sample(options);
      return view();
    }),
    stop() {
      stopping = true;
      abort.abort();
      windows.clear();
      candidates.clear();
      return queue;
    }
  };
}

// src/index.js
var name = "dsh-run-receipt";
var inject = ["schedule", "sessionQuery", "fs", "profileContext", "connection"];
var route = "/api/run-receipt";
function reply(status, value) {
  return Response.json(value, { status, headers: { "cache-control": "no-store" } });
}
function apply(ctx) {
  let monitor;
  try {
    monitor = createMonitor(ctx, ledgerAt(join(ctx.profileContext.dir, "run-receipt", "ledger.json")));
  } catch {
    ctx.logger.error("Run Receipt could not open the profile ledger.");
  }
  ctx.connection.fetch.register({
    path: route,
    methods: ["GET", "POST"],
    requestBody: "buffered",
    fetch: async (request) => {
      if (!monitor) return reply(503, { error: "storageUnavailable" });
      try {
        if (request.method === "GET") return reply(200, monitor.view());
        if (request.headers.get("x-dsh-plugin") !== name || !/^application\/json(?:\s*;|$)/iu.test(request.headers.get("content-type") ?? "")) {
          return reply(403, { error: "denied" });
        }
        const content = await request.text();
        if (content.length > 8192) return reply(413, { error: "invalidRule" });
        let payload;
        try {
          payload = JSON.parse(content);
        } catch {
          return reply(400, { error: "invalidRule" });
        }
        if (!payload || typeof payload !== "object" || Array.isArray(payload)) return reply(400, { error: "invalidRule" });
        if (payload.op === "refresh") return reply(200, await monitor.refresh({ refreshCatalog: true }));
        if (payload.op === "watch") return reply(200, await monitor.setWatch(payload));
        if (payload.op === "mark") return reply(200, await monitor.mark(payload));
        if (payload.op === "current") return reply(200, await monitor.current(payload, request.signal));
        return reply(400, { error: "invalidRule" });
      } catch (error2) {
        if (error2.publicCode) return reply(400, { error: error2.publicCode });
        if (request.signal.aborted) return reply(408, { error: "unavailable" });
        ctx.logger.warn("Run Receipt request did not complete.", error2.code ?? error2.name);
        return reply(503, { error: "unavailable" });
      }
    }
  });
  if (!monitor) return;
  let scheduled;
  let inProgress = false;
  let again = false;
  let stopped = false;
  const enqueueSample = (delay = 250) => {
    if (stopped || scheduled) return;
    if (inProgress) {
      again = true;
      return;
    }
    scheduled = setTimeout(async () => {
      scheduled = void 0;
      inProgress = true;
      try {
        await monitor.refresh();
      } catch (error2) {
        if (!stopped) ctx.logger.warn("Run Receipt observation did not complete.", error2.code ?? error2.name);
      } finally {
        inProgress = false;
        if (again) {
          again = false;
          enqueueSample();
        }
      }
    }, delay);
  };
  ctx.on("schedule/changed", () => enqueueSample());
  ctx.on("session/event", (session, event) => {
    try {
      if (monitor.onSessionEvent(session, event) === true) enqueueSample();
    } catch (error2) {
      ctx.logger.warn("Run Receipt could not record a file observation.", error2.code ?? error2.name);
    }
  });
  ctx.on("fs/observed", (target, observation, actor) => {
    try {
      monitor.onObserved(target, observation, actor);
    } catch (error2) {
      ctx.logger.warn("Run Receipt could not read a file observation.", error2.code ?? error2.name);
    }
  });
  ctx.effect(() => {
    const interval = setInterval(enqueueSample, SAMPLE_MS);
    enqueueSample(0);
    return () => {
      stopped = true;
      clearInterval(interval);
      clearTimeout(scheduled);
      return monitor.stop();
    };
  }, "Run Receipt observation lifecycle");
}
export {
  apply,
  inject,
  name
};
