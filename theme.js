/* ============================================================
   ديوان عبد الرحمن — the look and the tools
   (a poetry book: the cover opens, ink writes his name,
    a verse each week, red-ink seals and strikes, eight chapters)
   ============================================================ */
(function () {
'use strict';
var T = window.TRACKER;
var A = null;
var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
var $ = function (s) { return document.querySelector(s); };
var plDirty = false, vDirty = false;
function curWeek(C) { return Math.min(Math.max(C.week, 1), T.weeks); }
var bd = function (v) { return '<bdi dir="ltr">' + v + '</bdi>'; };

/* ---------------- the book opens, the ink writes ---------------- */
function openBook() {
  var hero = $('#hero');
  var go = function () {
    hero.classList.add('open');
    setTimeout(function () { hero.classList.add('ink'); }, reduce ? 0 : 700);
    setTimeout(function () { hero.classList.add('done'); }, reduce ? 0 : 1600);
  };
  var fonts = document.fonts && document.fonts.load ? Promise.all([document.fonts.load('700 80px "Aref Ruqaa"'), document.fonts.load('400 20px "Amiri"')]) : Promise.resolve();
  var started = false, start = function () { if (started) return; started = true; setTimeout(go, reduce ? 0 : 450); };
  fonts.then(start, start); setTimeout(start, 2500);
  /* write the name with a pen: each stroke follows the letter, right to left, at an even hand speed */
  var svg = $('#nameInk'), strokes = svg ? svg.querySelectorAll('#penStrokes path') : [];
  var write = function () {
    if (!strokes.length) return;
    if (reduce) { svg.classList.add('done'); return; }
    var t = 0, SPEED = 300; /* viewBox units per second */
    Array.prototype.forEach.call(strokes, function (p, i) {
      var L = p.getTotalLength(), d = Math.max(.18, L / SPEED);
      p.style.strokeDasharray = L + ' ' + (L + 20); p.style.strokeDashoffset = L;
      p.getBoundingClientRect();
      p.style.transition = 'stroke-dashoffset ' + d.toFixed(2) + 's cubic-bezier(.42,0,.58,1) ' + t.toFixed(2) + 's';
      p.style.strokeDashoffset = 0;
      t += d * .82 + (i < strokes.length - 1 && strokes[i + 1].dataset.lift ? .1 : 0);
    });
    setTimeout(function () { svg.classList.add('done'); }, (t + .6) * 1000);
  };
  var started2 = false;
  var go2 = function () { if (started2) return; started2 = true; setTimeout(write, reduce ? 0 : 650); };
  fonts.then(go2, go2); setTimeout(go2, 2600);
}

/* write verses with ink as they scroll into view */
var io = null;
function inkObserve(root) {
  var els = (root || document).querySelectorAll('.inkw:not(.inked)');
  if (reduce || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('inked'); }); return; }
  if (!io) io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('inked'); io.unobserve(e.target); } }); }, { threshold: .4 });
  els.forEach(function (e) { io.observe(e); });
}

/* ---------------- the poem of the weeks ---------------- */
var LBL = { future: '', now: 'يُكتَب الآن', ok: 'تمّ', exam: 'محفوظ', late: 'متأخّر', missed: 'سقط هذا البيت' };
function counts(C) {
  var o = { dev: 0, burn: 0, left: 0 };
  C.weeksInfo.forEach(function (w) { if (w.state === 'missed') o.burn++; else if (w.state === 'future' || w.state === 'now') o.left++; else o.dev++; });
  return o;
}
function verse(k) { var v = A.get('verse:' + k, '') || ''; var p = v.split('||'); return { a: (p[0] || '').trim(), b: (p[1] || '').trim() }; }
function verseCount() { var n = 0; for (var k = 1; k <= T.weeks; k++) { var v = verse(k); if (v.a || v.b) n++; } return n; }
function seal(state) {
  if (state === 'ok' || state === 'exam') return '<svg class="seal" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke-width="4"/><circle cx="50" cy="50" r="33" fill="none" stroke-width="1.5" stroke-dasharray="3 4"/><text x="50" y="62" text-anchor="middle">' + LBL[state] + '</text></svg>';
  return '';
}
var lastPoem = '';
function paintPoem(C) {
  var el = $('#poem'); if (!el) return;
  var me = A.isMe(), mgr = A.isMgr(), w = curWeek(C), html = '';
  C.weeksInfo.forEach(function (wi) {
    var k = wi.w, v = verse(k), has = v.a || v.b, st = wi.state;
    var body;
    if (has) {
      body = v.b ? '<span class="h h1 inkw">' + A.esc(v.a) + '</span><span class="sep" aria-hidden="true">✽</span><span class="h h2 inkw">' + A.esc(v.b) + '</span>'
                 : '<span class="h hs inkw">' + A.esc(v.a) + '</span>';
    } else if (st === 'future') body = '<span class="ph">يُكتَب في الأسبوع ' + bd(k) + ' · يبدأ ' + bd(A.fmtShort(A.weekStart(k))) + '</span>';
    else if (st === 'now') body = '<span class="ph now">' + (me ? 'بيت هذا الأسبوع بانتظار قلمك…' : 'لم يُكتَب بيت هذا الأسبوع بعد…') + '<i class="caret"></i></span>';
    else body = '<span class="ph">لم يُكتَب لهذا الأسبوع بيت.</span>';
    html += '<div class="vr ' + st + (has ? ' has' : '') + '" data-w="' + k + '">' +
      '<span class="vn">' + bd(k) + '</span>' +
      '<div class="vb">' + body + (st === 'missed' ? '<svg class="strike" viewBox="0 0 1000 40" preserveAspectRatio="none"><path d="M6 24 C 200 14, 420 30, 620 18 S 900 22, 994 16"/></svg>' : '') + '</div>' +
      '<div class="vm">' + seal(st) + (st !== 'ok' && st !== 'exam' && LBL[st] ? '<span class="vl">' + LBL[st] + '</span>' : '') + '<span class="vd">' + bd(A.fmtShort(A.weekStart(k))) + '</span></div>' +
      '</div>';
  });
  if (html !== lastPoem) { el.innerHTML = html; lastPoem = html; inkObserve(el); }
  var n = counts(C);
  $('#poemStats').innerHTML = '<div class="ps"><b>' + bd(verseCount()) + '</b>أبيات كُتبت</div><div class="ps"><b>' + bd(n.dev) + '</b>أسابيع خُتمت</div><div class="ps burn"><b>' + bd(n.burn) + '</b>أبيات سقطت</div><div class="ps"><b>' + bd(n.left) + '</b>باقية</div><div class="ps"><b>' + bd(C.streak) + '</b>أسابيع متتالية في وقتها</div>' +
    (mgr ? '<p class="ps-note">الديوان مفتوح للقراءة: يرى المشرف الأبيات كما كتبها عبد الرحمن.</p>' : '');
  paintForm(C);
  paintLatest(C);
}
function paintForm(C) {
  var f = $('#vForm'); if (!f) return;
  var me = A.isMe(), w = curWeek(C), show = me && C.week >= 1 && C.week <= T.weeks;
  f.classList.toggle('hidden', !show); if (!show) return;
  if (!f.firstChild) {
    f.innerHTML = '<div class="vf-h"><span class="vf-k">بيت الأسبوع <b id="vfW"></b></span><span class="vf-hint">ليس شرطًا أن يكون موزونًا. سطرٌ صادق يكفي: ما الذي رأيته هذا الأسبوع ولم تره من قبل؟</span></div>' +
      '<div class="vf-row"><input id="vA" maxlength="90" placeholder="الشطر الأول — أو سطرك كاملًا"><span class="sep" aria-hidden="true">✽</span><input id="vB" maxlength="90" placeholder="الشطر الثاني (اختياري)"></div>' +
      '<div class="vf-foot"><button class="btn btn-main btn-sm" id="vSave">اكتب البيت في الديوان</button><span class="vf-note">يقرأ المشرف الديوان أيضًا — فاكتب ما تحبّ أن يُقرأ باسمك.</span></div>';
    ['#vA', '#vB'].forEach(function (s) { $(s).addEventListener('input', function () { vDirty = true; }); });
    $('#vSave').addEventListener('click', function () {
      var a = $('#vA').value.trim().slice(0, 90), b = $('#vB').value.trim().slice(0, 90);
      if (!a && !b) { $('#vA').focus(); return; }
      if (!a) { a = b; b = ''; }
      var wk = curWeek(A.computed()); vDirty = false; lastPoem = '';
      A.burst($('#vSave'), 22); A.set('verse:' + wk, a + (b ? '||' + b : ''));
      if (!A.get('c:' + wk + ':verse', false)) A.set('c:' + wk + ':verse', 1);
      A.toast('كُتب البيت في ديوانك — بقلمك أنت ✒');
      var row = document.querySelector('.vr[data-w="' + wk + '"]'); if (row) row.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    });
  }
  $('#vfW').innerHTML = bd(w);
  var v = verse(w);
  if (!vDirty && document.activeElement !== $('#vA') && document.activeElement !== $('#vB')) { $('#vA').value = v.a; $('#vB').value = v.b; }
  $('#vSave').textContent = (v.a || v.b) ? 'عدّل بيت هذا الأسبوع' : 'اكتب البيت في الديوان';
}
var lastLatest = '';
function paintLatest(C) {
  var el = $('#latest'); if (!el) return;
  var k0 = 0; for (var k = T.weeks; k >= 1; k--) { var v = verse(k); if (v.a || v.b) { k0 = k; break; } }
  var html;
  if (k0) { var x = verse(k0); html = '<div class="lt-k">آخر بيت في الديوان · الأسبوع ' + bd(k0) + '</div><p class="lt-v inkw">' + A.esc(x.a) + (x.b ? '<span class="sep">✽</span>' + A.esc(x.b) : '') + '</p>'; }
  else html = '<div class="lt-k">البيت الأول</div><p class="lt-v empty">لم يُكتَب بعد… الصفحة بانتظار قلمك.</p>';
  html += '<div class="lt-bar"><span>' + bd(C.pct + '%') + ' من الديوان</span><i><b style="width:' + C.pct + '%"></b></i></div>';
  if (html !== lastLatest) { el.innerHTML = html; lastLatest = html; if ($('#hero').classList.contains('ink')) setTimeout(function () { inkObserve(el); }, reduce ? 0 : 2600); else setTimeout(function () { inkObserve(el); }, reduce ? 0 : 4300); }
}

/* ---------------- the eight chapters (his goals) ---------------- */
function frac(ids) { var d = 0; ids.forEach(function (id) { var t = A.ALL.filter(function (x) { return x.id === id; })[0]; if (t && A.stat(t) === 'done') d++; }); return ids.length ? d / ids.length : 0; }
function checkWeeks(id, C) { var n = 0; for (var k = 1; k <= C.studyWeeksSoFar; k++) if (A.get('c:' + k + ':' + id, false)) n++; return n; }
function goals(C) {
  var so = Math.max(1, C.studyWeeksSoFar), w = curWeek(C), chPct = function (id) { var x = C.chs.filter(function (y) { return y.ch.id === id; })[0]; return x ? x.pct / 100 : 0; };
  var en = checkWeeks('en', C), sp = checkWeeks('sport', C), mk = checkWeeks('market', C);
  return [
    { ico: '📚', t: 'التركيز على دراستي', d: 'ساعات أسبوعية تحسبها هنا، وأسبوع الامتحان يُختم بيته «محفوظ».', p: C.studyWeeksMet / so, st: A.hours(w) + ' / ' + A.studyGoal() + ' ساعة', go: '#studiesSec', g: '#2E8B7A' },
    { ico: '🎬', t: 'تعلّم DaVinci Resolve', d: 'التدريب الرسمي، ثم مونتاج 60 ثانية، ثم عرض المقال المصوّر.', p: frac(['c4', 'c6', 'd5']), st: 'الفصل الثالث', go: 'C3', g: '#C8674F' },
    { ico: '🗣', t: 'تحسين لغتي الإنجليزية', d: '3 جلسات أسبوعيًا، ودروس إنجليزية، وتعليقات صورك بالإنجليزية.', p: en / so, st: en + ' من ' + so + ' أسابيع', go: '#checks', g: '#3F6FB8' },
    { ico: '📷', t: 'العودة لمحتوى هادف', d: 'صورة تعرف لماذا وُجدت — حتى المقال المصوّر في النهاية.', p: (chPct('C1') + chPct('C2') + chPct('C4')) / 3, st: 'الفصول 1 و2 و4', go: 'C4', g: '#D4AF37' },
    { ico: '📣', t: 'تسويق نفسي', d: 'صفحة أعمال ونبذة بالعربية والإنجليزية، ونشر أسبوعي.', p: frac(['d6', 'd9']) * .6 + (mk / so) * .4, st: mk + ' أسابيع نشر', go: 'C4', g: '#7B5EA7' },
    { ico: '💪', t: 'لجسدك عليك حق', d: '«إنّ لجسدك عليك حقًّا» — كما كتبتَ. رياضة مرتين كل أسبوع.', p: sp / so, st: sp + ' من ' + so + ' أسابيع', go: '#checks', g: '#3FA796' },
    { ico: '💼', t: 'دخل أفضل — بلا ضغط عمل', d: 'العمل مع العملاء وصفحة الأعمال: أول خطوة نحو دخل من عمل تحبّه.', p: frac(['d9', 'd6']), st: 'الفصل الرابع', go: 'C4', g: '#B8865B' },
    { ico: '🎓', t: 'تدريب المدرّبين TOT معتمد', d: 'هدف ما بعد هذا الموسم — نختار البرنامج المعتمد معًا في يناير.', p: C.allDone ? .3 : 0, st: 'يناير 2027', go: '#library', g: '#5C7FB0' }
  ];
}
var ORD = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن'];
function paintBabs(C) {
  var el = $('#babs'); if (!el) return;
  el.innerHTML = goals(C).map(function (g, i) {
    var p = Math.max(0, Math.min(1, g.p));
    return '<a class="bab" href="' + (g.go.charAt(0) === '#' ? g.go : '#ch-' + g.go) + '" data-go="' + g.go + '">' +
      '<div class="bab-k">الباب ' + ORD[i] + '</div><h4>' + A.esc(g.t) + '</h4><p>' + A.esc(g.d) + '</p>' +
      '<svg class="kash" viewBox="0 0 400 34" preserveAspectRatio="none" aria-hidden="true"><path class="k0" d="M396 20 C 330 22, 200 24, 60 20 C 34 19, 14 12, 6 4"/><path class="k1" pathLength="100" style="stroke-dashoffset:' + (100 - p * 100).toFixed(1) + '" d="M396 20 C 330 22, 200 24, 60 20 C 34 19, 14 12, 6 4"/></svg>' +
      '<div class="bab-f"><span class="st">' + A.txt(g.st) + '</span><span class="where">' + (p >= 1 ? 'اكتمل الباب ✓' : bd(Math.round(p * 100) + '%')) + '</span></div></a>';
  }).join('');
  el.querySelectorAll('[data-go]').forEach(function (a) { var g = a.getAttribute('data-go'); if (g.charAt(0) !== '#') a.addEventListener('click', function (e) { e.preventDefault(); A.openChapter(g); }); });
}

/* ---------------- pledge (he writes it, he keeps it) ---------------- */
function plInit() {
  var el = $('#pledge'); if (!el) return;
  el.innerHTML = '<div class="pl-k">حاشية</div><h3>عهدي</h3><p>قلتَ إنك تعمل أفضل حين يكون هناك ما تخسره. فاختر بنفسك ما ستخسره إذا شُطب بيتان: صدقة تحدّد مبلغها، أو شيء تحبّه تتركه أسبوعًا. لا أحد يفرضه عليك.</p><p>هذا عهدك مع نفسك، لا مع المشرف — ولهذا هو أثقل.</p>' +
    '<div id="plAlert" class="pl-alert hidden"></div>' +
    '<div id="plEdit" class="hidden"><textarea id="plIn" maxlength="300" placeholder="مثال: إذا شُطب بيتان، أتصدّق بـ… وأعوّض الأسبوع الضائع في عطلة نهاية الأسبوع."></textarea>' +
    '<div class="pl-row" style="margin-top:8px"><button class="btn btn-main btn-sm" id="plSave">حفظ العهد</button><button class="btn btn-ghost btn-sm hidden" id="plKept">وفيتُ بعهدي ✓</button></div></div>' +
    '<div id="plShow" class="pl-show hidden"></div>';
  var inp = $('#plIn');
  inp.addEventListener('input', function () { plDirty = true; });
  $('#plSave').addEventListener('click', function () {
    var v = inp.value.trim().slice(0, 300); plDirty = false;
    A.burst($('#plSave'), 18); A.set('pledge', v);
    A.toast(v ? 'كُتب العهد — الكلمة كلمتك' : 'حُذف العهد');
  });
  $('#plKept').addEventListener('click', function () {
    var n = counts(A.computed()); A.set('kept', n.burn); A.toast('وفيتَ بما قلت. صفحة جديدة 🤍');
  });
}
function paintPledge(C) {
  if (!$('#plEdit')) return;
  var v = A.get('pledge', ''), me = A.isMe(), n = counts(C), kept = +A.get('kept', 0) || 0;
  var due = Math.floor(n.burn / 2) > Math.floor(kept / 2);
  $('#plEdit').classList.toggle('hidden', !me);
  var inp = $('#plIn'); if (me && !plDirty && document.activeElement !== inp) inp.value = v;
  var show = $('#plShow');
  show.classList.toggle('hidden', me && !v ? true : false);
  show.textContent = v ? '«' + v + '»' : 'لم يُكتب العهد بعد.';
  if (me && !v) show.classList.add('hidden');
  var al = $('#plAlert'); al.classList.toggle('hidden', !due);
  if (due) al.textContent = 'شُطب بيتان بالحبر الأحمر. حان وقت الوفاء بعهدك — ثم نبدأ صفحة جديدة، بلا جلد للذات.';
  $('#plKept').classList.toggle('hidden', !due);
}

/* ---------------- hooks ---------------- */
T.hooks = {
  init: function (api) { A = api; openBook(); plInit(); },
  render: function (C) { paintPoem(C); paintBabs(C); paintPledge(C); },
  managerExtra: function (C, api) {
    var n = counts(C), w = curWeek(C), habits = T.checks.filter(function (c) { return api.get('c:' + w + ':' + c.id, false); }).length, pl = api.get('pledge', '');
    return '<div class="mgr-extra">' +
      '<div class="mgr-box"><b>القصيدة</b>' + n.dev + ' خُتمت · ' + n.burn + ' سقطت · ' + n.left + ' باقية</div>' +
      '<div class="mgr-box"><b>الأبيات</b>' + verseCount() + ' من ' + T.weeks + ' كُتبت</div>' +
      '<div class="mgr-box"><b>عهده</b>' + (pl ? api.esc(pl) : 'لم يُكتب بعد') + '</div>' +
      '<div class="mgr-box"><b>عادات الأسبوع ' + w + '</b>' + habits + ' من ' + T.checks.length + '</div></div>';
  },
  celebration: function (ch) {
    return ({
      C1: { ico: '✒', h: 'اكتمل الفصل الأول', p: 'اكتمل فصل «النيّة». صورتك الآن تعرف لماذا وُجدت — وهذا ما لا تعرفه أي آلة.' },
      C2: { ico: '🤝', h: 'اكتمل الفصل الثاني', p: 'اكتمل فصل «الكرامة والثقة». صوّرتَ الناس كما هم، لا كما تريدهم الكاميرا.' },
      C3: { ico: '📐', h: 'اكتمل الفصل الثالث', p: 'اكتمل فصل «الزاوية». صرتَ تختار زاويتك بنيّة، وتبني قصتك في المونتاج.' },
      C4: { ico: '📖', h: 'اكتمل ديوانك الأول', p: 'اكتمل المقال المصوّر والمسار كله. ديوانٌ باسمك: أبياتٌ بقلمك، وصورٌ بعدستك.' }
    })[ch.id] || { ico: '📖', h: 'اكتمل الفصل', p: '' };
  }
};
})();
