/* Tiny dependency-free syntax highlighter for Java and SQL code blocks. */
(function () {
  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  var JAVA_KEYWORDS = new Set(("abstract assert boolean break byte case catch char class const continue default do double else enum " +
    "extends final finally float for goto if implements import instanceof int interface long native new package private protected " +
    "public return short static strictfp super switch synchronized this throw throws transient try void volatile while var record " +
    "yield sealed permits true false null").split(" "));

  var SQL_KEYWORDS = new Set(("select from where group by having order limit offset join inner left right full outer on as and or not " +
    "in exists between like is null distinct union all insert into values update set delete create table index primary key foreign " +
    "references unique constraint alter drop case when then else end count sum avg min max desc asc with").split(" "));

  // comment | string | char | annotation | number | word | anything else
  var TOKEN = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|--[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(@[A-Za-z_]\w*)|(\b\d[\d_]*(?:\.\d+)?[fFdDlL]?\b)|([A-Za-z_]\w*)/g;

  function highlight(code, lang) {
    lang = (lang || "").toLowerCase();
    if (lang !== "java" && lang !== "sql") return esc(code);
    var keywords = lang === "sql" ? SQL_KEYWORDS : JAVA_KEYWORDS;
    var out = "";
    var last = 0;
    var m;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(code)) !== null) {
      out += esc(code.slice(last, m.index));
      last = TOKEN.lastIndex;
      var t = m[0];
      if (m[1]) {
        // "--" comments are SQL-only; in Java treat as plain text
        if (t.startsWith("--") && lang !== "sql") out += esc(t);
        else out += '<span class="tok-comment">' + esc(t) + "</span>";
      } else if (m[2]) {
        out += '<span class="tok-string">' + esc(t) + "</span>";
      } else if (m[3]) {
        out += '<span class="tok-annotation">' + esc(t) + "</span>";
      } else if (m[4]) {
        out += '<span class="tok-number">' + esc(t) + "</span>";
      } else if (m[5]) {
        var w = lang === "sql" ? t.toLowerCase() : t;
        if (keywords.has(w)) out += '<span class="tok-keyword">' + esc(t) + "</span>";
        else if (lang === "java" && /^[A-Z]/.test(t)) out += '<span class="tok-type">' + esc(t) + "</span>";
        else out += esc(t);
      }
    }
    out += esc(code.slice(last));
    return out;
  }

  window.Highlight = { highlight: highlight, esc: esc };
})();
