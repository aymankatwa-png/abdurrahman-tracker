/* ============================================================
   طاولة المحرّر — the look and the tools
   (light table, real contact sheet + loupe, grease-pencil marks,
    test strips for his goals, the roll of weeks, backs of prints)
   ============================================================ */
(function () {
'use strict';
var T = window.TRACKER;
var A = null;
var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
var $ = function (s) { return document.querySelector(s); };
var plDirty = false, tkDirty = false, flipped = {};
function curWeek(C) { return Math.min(Math.max(C.week, 1), T.weeks); }
function setText(id, v) { var n = document.getElementById(id); if (n) n.textContent = v; }

/* ---------------- the table lights up ---------------- */
function lightUp() {
  var h = $('#hero'), img = $('#sheetImg');
  var go = function () { setTimeout(function () { h.classList.add('live'); }, reduce ? 0 : 250); };
  if (img && !img.complete) img.addEventListener('load', go); else go();
  setTimeout(function () { h.classList.add('live'); }, 2500);
  /* a finished task = a shutter blink */
  document.addEventListener('click', function (e) { var b = e.target.closest('[data-task][data-to="pending"]'); if (b && A.isMe()) { var k = $('#blink'); k.classList.remove('go'); void k.offsetWidth; k.classList.add('go'); } });
}

/* ---------------- Ibn al-Haytham's rays behind the portrait ---------------- */
function optics() {
  var g = $('#optRays'), dg = $('#optDots'); if (!g) return;
  var NS = 'http://www.w3.org/2000/svg', P = { x: 96, y: 300 }, rays = [], dots = [];
  for (var i = 0; i < 9; i++) {
    var y = 60 + i * 65, ex = 0, ey = P.y - (y - P.y) * (P.x - ex) / (600 - P.x);
    var pa = document.createElementNS(NS, 'path');
    pa.setAttribute('d', 'M600 ' + y + ' L' + P.x + ' ' + P.y + ' L' + ex + ' ' + ey.toFixed(1));
    pa.style.transitionDelay = (i * .08) + 's';
    g.appendChild(pa); rays.push({ y: y, ey: ey });
  }
  for (var k = 0; k < 18; k++) { var c = document.createElementNS(NS, 'circle'); c.setAttribute('r', '2.4'); dg.appendChild(c); dots.push({ el: c, r: k % 9, t: Math.random() }); }
  if (reduce) return;
  (function step() {
    dots.forEach(function (d) {
      d.t += .004; if (d.t > 1) d.t = 0;
      var R = rays[d.r], x, y, u;
      if (d.t < .8) { u = d.t / .8; x = 600 + (P.x - 600) * u; y = R.y + (P.y - R.y) * u; }
      else { u = (d.t - .8) / .2; x = P.x - P.x * u; y = P.y + (R.ey - P.y) * u; }
      d.el.setAttribute('cx', x.toFixed(1)); d.el.setAttribute('cy', y.toFixed(1)); d.el.setAttribute('opacity', (Math.sin(d.t * Math.PI) * .85).toFixed(2));
    });
    requestAnimationFrame(step);
  })();
}

/* ---------------- the loupe ---------------- */
function loupe() {
  var sh = $('#sheet'), lp = $('#loupe'), img = $('#sheetImg'); if (!sh || !lp) return;
  var Z = 2.6, auto = null, autoT = 0;
  lp.style.backgroundImage = 'url(' + img.getAttribute('src') + ')';
  function place(x, y) {
    var w = sh.clientWidth, h = sh.clientHeight;
    lp.style.left = x + 'px'; lp.style.top = y + 'px';
    lp.style.backgroundSize = (w * Z) + 'px ' + (h * Z) + 'px';
    var r = lp.clientWidth / 2;
    lp.style.backgroundPosition = (-(x * Z - r)) + 'px ' + (-(y * Z - r)) + 'px';
  }
  function local(e) {
    /* the sheet is rotated a little: undo it so the loupe shows what is really under the finger */
    var rect = sh.getBoundingClientRect(), cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    var a = -1.4 * Math.PI / 180, dx = e.clientX - cx, dy = e.clientY - cy;
    return { x: sh.clientWidth / 2 + dx * Math.cos(a) - dy * Math.sin(a), y: sh.clientHeight / 2 + dx * Math.sin(a) + dy * Math.cos(a) };
  }
  sh.addEventListener('pointermove', function (e) { stopAuto(); var p = local(e); place(p.x, p.y); lp.classList.add('on'); });
  sh.addEventListener('pointerdown', function (e) { stopAuto(); var p = local(e); place(p.x, p.y); lp.classList.add('on'); });
  sh.addEventListener('pointerleave', function () { lp.classList.remove('on'); startAuto(3000); });
  function stopAuto() { cancelAnimationFrame(auto); auto = null; clearTimeout(autoT); }
  function startAuto(delay) {
    if (reduce) return; clearTimeout(autoT);
    autoT = setTimeout(function () {
      var t0 = performance.now();
      (function step(t) {
        var k = (t - t0) / 1000, w = sh.clientWidth, h = sh.clientHeight;
        /* drift across the chosen frame and its neighbours, the way an editor scans */
        var x = w * (.5 + .38 * (.5 + .5 * Math.sin(k * .5))), y = h * (.5 + .3 * Math.sin(k * .37));
        place(x, y); lp.classList.add('on');
        if (k < 7) auto = requestAnimationFrame(step); else { lp.classList.remove('on'); startAuto(4000); }
      })(t0);
    }, delay);
  }
  startAuto(6500);
}

/* ---------------- frame counter ---------------- */
function paintCounter(C) {
  var n = Math.round(C.pct * 36 / 100);
  setText('cWin', (n < 10 ? '0' : '') + n);
  var b = $('#cBar'); if (b) b.style.width = C.pct + '%';
}

/* ---------------- the roll of weeks with grease-pencil marks ---------------- */
var LBL = { future: '', now: 'يُصوَّر الآن', ok: 'مُختار', exam: 'محفوظ · امتحانات', late: 'متأخر', missed: 'مشطوب' };
function counts(C) {
  var o = { dev: 0, burn: 0, left: 0 };
  C.weeksInfo.forEach(function (w) { if (w.state === 'missed') o.burn++; else if (w.state === 'future' || w.state === 'now') o.left++; else o.dev++; });
  return o;
}
function mark(state) {
  if (state === 'ok') return '<svg viewBox="0 0 100 100"><path class="mk" stroke="#ff3b52" d="M50 8 C 82 6, 96 30, 92 56 C 88 84, 60 96, 36 90 C 12 84, 4 58, 10 36 C 16 16, 36 8, 58 10"/></svg>';
  if (state === 'exam') return '<svg viewBox="0 0 100 100"><path class="mk" stroke="#5b8cff" d="M50 8 C 82 6, 96 30, 92 56 C 88 84, 60 96, 36 90 C 12 84, 4 58, 10 36 C 16 16, 36 8, 58 10"/></svg>';
  if (state === 'missed') return '<svg viewBox="0 0 100 100"><path class="mk" stroke="#ff3b52" stroke-width="9" d="M16 18 L86 84 M84 16 L18 86"/></svg>';
  if (state === 'late') return '<svg viewBox="0 0 100 100"><path class="mk" stroke="#F2C230" d="M14 92 C 40 88, 62 90, 88 86 M18 98 C 44 95, 66 97, 84 94"/></svg>';
  return '';
}
function paintRoll(C) {
  var el = $('#rollStrip'); if (!el) return;
  el.innerHTML = C.weeksInfo.map(function (w) {
    return '<div class="wf ' + w.state + '" title="الأسبوع ' + w.w + '"><span class="wf-big">' + w.w + '</span>' + mark(w.state) +
      '<span class="wf-l">' + (LBL[w.state] || '') + '</span><span class="wf-n">' + w.w + ' · ' + A.fmtShort(A.weekStart(w.w)) + '</span></div>';
  }).join('');
  var n = counts(C);
  $('#rollStats').innerHTML = '<div class="ss"><b>' + n.dev + '</b>إطارات مُختارة</div><div class="ss burn"><b>' + n.burn + '</b>مشطوبة</div><div class="ss"><b>' + n.left + '</b>باقية في البكرة</div><div class="ss"><b>' + C.streak + '</b>أسابيع متتالية في وقتها</div>';
}

/* ---------------- test strips for his eight goals ---------------- */
function frac(ids) { var d = 0; ids.forEach(function (id) { var t = A.ALL.filter(function (x) { return x.id === id; })[0]; if (t && A.stat(t) === 'done') d++; }); return ids.length ? d / ids.length : 0; }
function checkWeeks(id, C) { var n = 0; for (var k = 1; k <= C.studyWeeksSoFar; k++) if (A.get('c:' + k + ':' + id, false)) n++; return n; }
function goals(C) {
  var so = Math.max(1, C.studyWeeksSoFar), w = curWeek(C), chPct = function (id) { var x = C.chs.filter(function (y) { return y.ch.id === id; })[0]; return x ? x.pct / 100 : 0; };
  var en = checkWeeks('en', C), sp = checkWeeks('sport', C), mk = checkWeeks('market', C);
  return [
    { ico: '📚', t: 'التركيز على دراستي', d: 'ساعات أسبوعية تحسبها هنا، وأسبوع الامتحان يُحفظ إطاره.', p: C.studyWeeksMet / so, st: A.hours(w) + ' / ' + A.studyGoal() + ' ساعة', go: '#studiesSec', g: '#2E8B7A' },
    { ico: '🎬', t: 'تعلّم DaVinci Resolve', d: 'التدريب الرسمي، ثم مونتاج 60 ثانية، ثم عرض المقال المصوّر.', p: frac(['c4', 'c6', 'd5']), st: 'البكرة الثالثة', go: 'C3', g: '#C8674F' },
    { ico: '🗣', t: 'تحسين لغتي الإنجليزية', d: '3 جلسات أسبوعيًا، ودروس إنجليزية، وتعليقات صورك بالإنجليزية.', p: en / so, st: en + ' من ' + so + ' أسابيع', go: '#checks', g: '#3F6FB8' },
    { ico: '📷', t: 'العودة لمحتوى هادف', d: 'صورة تعرف لماذا وُجدت — حتى المقال المصوّر في النهاية.', p: (chPct('C1') + chPct('C2') + chPct('C4')) / 3, st: 'البكرات 1 و2 و4', go: 'C4', g: '#D4AF37' },
    { ico: '📣', t: 'تسويق نفسي', d: 'صفحة أعمال ونبذة بالعربية والإنجليزية، ونشر أسبوعي.', p: frac(['d6', 'd9']) * .6 + (mk / so) * .4, st: mk + ' أسابيع نشر', go: 'C4', g: '#7B5EA7' },
    { ico: '💪', t: 'لجسدك عليك حق', d: '«إنّ لجسدك عليك حقًّا» — كما كتبتَ. رياضة مرتين كل أسبوع.', p: sp / so, st: sp + ' من ' + so + ' أسابيع', go: '#checks', g: '#3FA796' },
    { ico: '💼', t: 'دخل أفضل — بلا ضغط عمل', d: 'العمل مع العملاء وصفحة الأعمال: أول خطوة نحو دخل من عمل تحبّه.', p: frac(['d9', 'd6']), st: 'البكرة الرابعة', go: 'C4', g: '#B8865B' },
    { ico: '🎓', t: 'تدريب المدرّبين TOT معتمد', d: 'هدف ما بعد هذا الموسم — نختار البرنامج المعتمد معًا في يناير.', p: C.allDone ? .3 : 0, st: 'يناير 2027', go: '#library', g: '#5C7FB0' }
  ];
}
var STEPS = ['2s', '4s', '8s', '11s', '16s', '22s', '32s', '45s'];
function paintStrips(C) {
  var el = $('#strips'); if (!el) return;
  var imgs = [1, 6, 8, 10, 12, 5, 2, 7];
  el.innerHTML = goals(C).map(function (g, i) {
    var p = Math.max(0, Math.min(1, g.p)), on = Math.round(p * 8), bands = '';
    for (var b = 0; b < 8; b++) {
      var lit = b < on; /* exposure builds step by step: 2s, 4s, 8s… */
      var tone = Math.round(232 - b * 27);
      bands += '<span class="band step ' + (lit ? 'on' : 'off') + '"' + (lit ? ' style="background:rgb(' + tone + ',' + (tone - 6) + ',' + (tone - 16) + ')"' : '') + '><b' + (lit && b < 3 ? ' style="color:#5b4a33;text-shadow:none"' : '') + '>' + STEPS[b] + '</b></span>';
    }
    return '<a class="strip-card" href="' + (g.go.charAt(0) === '#' ? g.go : '#ch-' + g.go) + '" data-go="' + g.go + '"><i class="tp"></i><div class="strip">' + bands + '</div>' +
      '<div class="strip-meta"><span class="strip-ico">' + g.ico + '</span><div><h4>' + A.esc(g.t) + '</h4><p>' + A.esc(g.d) + '</p></div></div>' +
      '<div class="strip-foot"><span class="st">' + A.esc(g.st) + '</span><span class="where">' + (p >= 1 ? 'ظهرت الصورة كاملة ✓' : 'افتح في المسار ←') + '</span></div></a>';
  }).join('');
  el.querySelectorAll('[data-go]').forEach(function (a) { var g = a.getAttribute('data-go'); if (g.charAt(0) !== '#') a.addEventListener('click', function (e) { e.preventDefault(); A.openChapter(g); }); });
}

/* ---------------- pledge (he writes it, he keeps it) ---------------- */
function plInit() {
  var el = $('#pledge'); if (!el) return;
  el.innerHTML = '<h3>عهدي</h3><p>قلتَ إنك تعمل أفضل حين يكون هناك ما تخسره. فاختر بنفسك ما ستخسره إذا شُطب إطاران: صدقة تحدّد مبلغها، أو شيء تحبّه تتركه أسبوعًا. لا أحد يفرضه عليك.</p><p>هذا عهدك مع نفسك، لا مع المشرف — ولهذا هو أثقل.</p>' +
    '<div id="plAlert" class="pl-alert hidden"></div>' +
    '<div id="plEdit" class="hidden"><textarea id="plIn" maxlength="300" placeholder="مثال: إذا شُطب إطاران، أتصدّق بـ… وأعوّض الأسبوع الضائع في عطلة نهاية الأسبوع."></textarea>' +
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
  if (due) al.textContent = 'شُطب إطاران بالأحمر. حان وقت الوفاء بعهدك — ثم نبدأ بكرة جديدة، بلا جلد للذات.';
  $('#plKept').classList.toggle('hidden', !due);
}

/* ---------------- the backs of the prints (his weekly notes) ---------------- */
function tkInit() {
  var el = $('#talkCard'); if (!el) return;
  el.innerHTML = '<div class="prints" id="tkList"></div><div class="talk-lock hidden" id="tkLock"></div>' +
    '<div class="talk-form hidden" id="tkForm"><label for="tkIn" id="tkLbl">اكتب خلف إطار هذا الأسبوع</label>' +
    '<textarea id="tkIn" maxlength="400" placeholder="هذا الأسبوع خفتُ من… لكنني… وتعلّمت أن…"></textarea><div><button class="btn btn-main btn-sm" id="tkSave">اكتب خلف الصورة</button></div></div>';
  var inp = $('#tkIn');
  inp.addEventListener('input', function () { tkDirty = true; });
  $('#tkSave').addEventListener('click', function () {
    var v = inp.value.trim().slice(0, 400); if (!v) { inp.focus(); return; }
    var w = curWeek(A.computed()); tkDirty = false; flipped[w] = true;
    A.burst($('#tkSave'), 20); A.set('talk:' + w, v);
    if (!A.get('c:' + w + ':talk', false)) A.set('c:' + w + ':talk', 1);
    A.toast('كُتبت خلف الصورة — لعبد الرحمن في ديسمبر ✉');
  });
  $('#tkList').addEventListener('click', function (e) { var p = e.target.closest('[data-pr]'); if (!p) return; var k = p.getAttribute('data-pr'); flipped[k] = !flipped[k]; p.classList.toggle('flip', !!flipped[k]); });
}
function talkCount() { var n = 0; for (var k = 1; k <= T.weeks; k++) if (A.get('talk:' + k, '')) n++; return n; }
function paintTalk(C) {
  if (!$('#tkList')) return;
  var me = A.isMe(), mgr = A.isMgr(), w = curWeek(C), upto = C.week > T.weeks ? T.weeks : w;
  $('#tkForm').classList.toggle('hidden', !me);
  $('#tkList').classList.toggle('hidden', !me);
  var lock = $('#tkLock'); lock.classList.toggle('hidden', !mgr);
  if (mgr) lock.innerHTML = 'كتب عبد الرحمن خلف <b>' + talkCount() + '</b> من ' + upto + ' صور. ما خلف الصور له وحده — لا يُعرض هنا.';
  if (!me) return;
  var html = '';
  for (var k = 1; k <= upto; k++) {
    var t = A.get('talk:' + k, '');
    html += '<div class="pr' + (flipped[k] ? ' flip' : '') + '" data-pr="' + k + '"><div class="pr-f"><span>الأسبوع ' + k + '</span><small>اضغط لتقلبها</small></div>' +
      '<div class="pr-b"><span class="d">WEEK ' + k + ' · ' + A.fmtShort(A.weekStart(k)) + '</span><p' + (t ? '' : ' class="empty"') + '>' + (t ? A.esc(t) : 'لم يُكتب خلفها شيء بعد…') + '</p></div></div>';
  }
  $('#tkList').innerHTML = html;
  setText('tkLbl', 'اكتب خلف إطار الأسبوع ' + w + ' — سطرين لعبد الرحمن في ديسمبر');
  var inp = $('#tkIn'); if (!tkDirty && document.activeElement !== inp) inp.value = A.get('talk:' + w, '');
}

/* ---------------- hooks ---------------- */
T.hooks = {
  init: function (api) { A = api; lightUp(); optics(); plInit(); tkInit(); },
  render: function (C) { paintStrips(C); paintRoll(C); paintPledge(C); paintTalk(C); },
  managerExtra: function (C, api) {
    var n = counts(C), w = curWeek(C), habits = T.checks.filter(function (c) { return api.get('c:' + w + ':' + c.id, false); }).length, pl = api.get('pledge', '');
    return '<div class="mgr-extra">' +
      '<div class="mgr-box"><b>البكرة</b>' + n.dev + ' مُختار · ' + n.burn + ' مشطوب · ' + n.left + ' باقٍ</div>' +
      '<div class="mgr-box"><b>عهده</b>' + (pl ? api.esc(pl) : 'لم يُكتب بعد') + '</div>' +
      '<div class="mgr-box"><b>خلف الصور</b>' + talkCount() + ' رسالة (المحتوى خاص به)</div>' +
      '<div class="mgr-box"><b>عادات الأسبوع ' + w + '</b>' + habits + ' من ' + T.checks.length + '</div></div>';
  },
  celebration: function (ch) {
    return ({
      C1: { ico: '🎞', h: 'اكتملت البكرة الأولى', p: 'اكتمل فصل «النيّة». صورتك الآن تعرف لماذا وُجدت — وهذا ما لا تعرفه أي آلة.' },
      C2: { ico: '🤝', h: 'اكتملت البكرة الثانية', p: 'اكتمل فصل «الكرامة والثقة». صوّرتَ الناس كما هم، لا كما تريدهم الكاميرا.' },
      C3: { ico: '📐', h: 'اكتملت البكرة الثالثة', p: 'اكتمل فصل «الزاوية». صرتَ تختار زاويتك بنيّة، وتبني قصتك في المونتاج.' },
      C4: { ico: '⭕', h: 'المحرّر اختارك', p: 'اكتمل المقال المصوّر والمسار كله. دائرة حمراء على البكرة كلها — بقلمك أنت.' }
    })[ch.id] || { ico: '🎞', h: 'اكتملت البكرة', p: '' };
  }
};
})();
