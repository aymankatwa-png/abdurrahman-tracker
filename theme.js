/* ============================================================
   دار عبد الرحمن — the look and the tools
   (carved door, zellige that blooms, lanterns, arcade of weeks,
    eight goal tiles, his own pledge, the weekly dialogue)
   ============================================================ */
(function () {
'use strict';
var T = window.TRACKER;
var A = null;
var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
var $ = function (s) { return document.querySelector(s); };
var plDirty = false, tkDirty = false;
function curWeek(C) { return Math.min(Math.max(C.week, 1), T.weeks); }
function setText(id, v) { var n = document.getElementById(id); if (n) n.textContent = v; }
var LANT = '<svg class="lantern" viewBox="0 0 80 210" aria-hidden="true"><line x1="40" y1="0" x2="40" y2="38" stroke="#9c7a33" stroke-width="2"/><circle cx="40" cy="40" r="4" fill="none" stroke="#b8913c" stroke-width="2"/><path d="M27 44h26l-4 12H31z" fill="#b8913c"/><path class="glass" d="M21 56h38l7 30-7 50H21l-7-50z"/><g stroke="#8a6a2a" stroke-width="2.2" fill="none"><path d="M21 56l7 30-7 50M59 56l-7 30 7 50M40 56v80M14 86h52"/><path d="M40 62l8 12-8 12-8-12z M40 98l8 12-8 12-8-12z"/></g><path d="M21 136h38l-9 16H30z" fill="#b8913c"/><path d="M34 152h12l-6 14z" fill="#9c7a33"/></svg>';
var STAR = 'M50 2 L61.5 22.3 L84 16 L77.7 38.5 L98 50 L77.7 61.5 L84 84 L61.5 77.7 L50 98 L38.5 77.7 L16 84 L22.3 61.5 L2 50 L22.3 38.5 L16 16 L38.5 22.3Z';

/* ---------------- the carved door opens ---------------- */
function door() {
  var d = $('#door'), hero = $('#hero');
  var live = function () { hero.classList.add('live'); };
  if (!d) { live(); return; }
  if (reduce) { d.classList.add('gone'); live(); return; }
  var opened = false;
  function open() { if (opened) return; opened = true; d.classList.add('open'); setTimeout(live, 700); setTimeout(function () { d.classList.add('gone'); }, 2000); }
  d.addEventListener('click', open);
  setTimeout(open, 700);
}

/* ---------------- zellige that blooms from the centre + light that follows the hand ---------------- */
function geo() {
  var c = $('#geo'), hero = $('#hero'); if (!c) return;
  var x = c.getContext('2d'), W, H, dpr = Math.min(2, window.devicePixelRatio || 1), dim, bright, mask, mk, mx = .7, my = .3, tx = .7, ty = .3, t0 = 0, on = true, hand = false;
  function pattern(col, a, lw) {
    var cv = document.createElement('canvas'); cv.width = W * dpr; cv.height = H * dpr;
    var g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.strokeStyle = col; g.globalAlpha = a; g.lineWidth = lw;
    var S = W < 700 ? 86 : 118, R = S * .4, r2 = S * .17;
    for (var i = -1; i <= W / S + 1; i++) for (var j = -1; j <= H / S + 1; j++) {
      var cx = i * S, cy = j * S;
      g.beginPath();
      for (var k = 0; k < 16; k++) { var ang = k * Math.PI / 8 - Math.PI / 2, rr = k % 2 ? R * .62 : R; g[k ? 'lineTo' : 'moveTo'](cx + rr * Math.cos(ang), cy + rr * Math.sin(ang)); }
      g.closePath(); g.stroke();
      g.beginPath(); g.arc(cx, cy, R * .3, 0, 6.283); g.stroke();
      g.beginPath(); g.moveTo(cx + R, cy); g.lineTo(cx + S - R, cy); g.moveTo(cx, cy + R); g.lineTo(cx, cy + S - R); g.stroke();
      var ox = cx + S / 2, oy = cy + S / 2; g.beginPath();
      for (var m = 0; m < 8; m++) { var an = m * Math.PI / 4; g[m ? 'lineTo' : 'moveTo'](ox + r2 * Math.cos(an), oy + r2 * Math.sin(an)); }
      g.closePath(); g.stroke();
    }
    return cv;
  }
  function size() {
    W = c.clientWidth; H = c.clientHeight; c.width = W * dpr; c.height = H * dpr;
    dim = pattern('#D4AF37', .16, 1.1); bright = pattern('#FFE7A0', .9, 1.4);
    mask = document.createElement('canvas'); mask.width = W * dpr; mask.height = H * dpr; mk = mask.getContext('2d');
  }
  function draw(t) {
    if (!t0) t0 = t;
    var age = (t - t0) / 1000, bloom = reduce ? 1 : Math.min(1, Math.max(0, (age - .6) / 2.6)), maxR = Math.hypot(W, H);
    if (!hand) { tx = .5 + .32 * Math.cos(age * .25); ty = .4 + .2 * Math.sin(age * .33); }
    mx += (tx - mx) * .06; my += (ty - my) * .06;
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, c.width, c.height);
    x.save(); x.beginPath(); x.arc(W * .5 * dpr, H * .45 * dpr, maxR * dpr * (bloom * bloom * (3 - 2 * bloom)), 0, 6.283); x.clip();
    x.drawImage(dim, 0, 0);
    mk.globalCompositeOperation = 'source-over'; mk.clearRect(0, 0, mask.width, mask.height);
    var gr = mk.createRadialGradient(mx * W * dpr, my * H * dpr, 0, mx * W * dpr, my * H * dpr, 260 * dpr);
    gr.addColorStop(0, 'rgba(0,0,0,.95)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    mk.fillStyle = gr; mk.fillRect(0, 0, mask.width, mask.height);
    mk.globalCompositeOperation = 'source-in'; mk.drawImage(bright, 0, 0);
    x.drawImage(mask, 0, 0);
    x.restore();
  }
  function loop(t) { if (on) draw(t); requestAnimationFrame(loop); }
  size(); addEventListener('resize', size);
  hero.addEventListener('pointermove', function (e) { var r = hero.getBoundingClientRect(); hand = true; tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height; });
  hero.addEventListener('pointerleave', function () { hand = false; });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { on = en[0].isIntersecting; }).observe(c);
  if (reduce) draw(1); else requestAnimationFrame(loop);
  /* the lanterns lean a little toward the hand */
  addEventListener('pointermove', function (e) { var a = $('.lamp-a'); if (a && !reduce) a.style.marginTop = ((e.clientY / innerHeight - .5) * 6).toFixed(1) + 'px'; });
  /* every task he finishes lights a lamp */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-task][data-to="pending"]'); if (!b || !A.isMe()) return;
    var g = $('#glowBurst'); if (!g) return; g.style.setProperty('--gx', e.clientX + 'px'); g.style.setProperty('--gy', e.clientY + 'px');
    g.classList.remove('go'); void g.offsetWidth; g.classList.add('go');
  });
}

/* ---------------- progress rosette (eight petals) ---------------- */
function rosetteInit() {
  var el = $('#rosette'); if (!el) return;
  var petals = '';
  for (var i = 0; i < 8; i++) petals += '<path class="petal" d="M50 50 L44 18 L50 4 L56 18Z" transform="rotate(' + (i * 45) + ' 50 50)"/>';
  el.innerHTML = '<svg viewBox="0 0 100 100">' + petals + '<circle cx="50" cy="50" r="9" fill="#0A1325" stroke="#D4AF37" stroke-width="1.5"/></svg><div class="ros-t"><b class="en" id="rosPct">0%</b><span>من المسار — بتلةٌ لكل ثُمن</span></div>';
}
function paintRosette(C) {
  var ps = document.querySelectorAll('#rosette .petal'), f = C.pct / 12.5;
  ps.forEach(function (p, i) { p.classList.toggle('on', i < Math.floor(f)); p.classList.toggle('half', i === Math.floor(f) && f % 1 >= .4); });
  setText('rosPct', C.pct + '%');
}

/* ---------------- arcade of weeks: a lantern under every arch ---------------- */
var LBL = { future: 'لم يُضأ بعد', now: 'يُضاء الآن', ok: 'مضاء', exam: 'مضاء · امتحانات', late: 'أُضيء متأخرًا', missed: 'انطفأ' };
function counts(C) {
  var o = { dev: 0, burn: 0, left: 0 };
  C.weeksInfo.forEach(function (w) { if (w.state === 'missed') o.burn++; else if (w.state === 'future' || w.state === 'now') o.left++; else o.dev++; });
  return o;
}
var ARCH = '<svg class="archB" viewBox="0 0 100 150"><path class="in" d="M14 150 V70 C14 70 6 58 6 44 A44 44 0 1 1 94 44 C94 58 86 70 86 70 V150Z"/><path class="fr" d="M14 150 V70 C14 70 6 58 6 44 A44 44 0 1 1 94 44 C94 58 86 70 86 70 V150"/></svg>';
function paintArcade(C) {
  var el = $('#arcade'); if (!el) return;
  el.innerHTML = C.weeksInfo.map(function (w) {
    return '<div class="bay ' + w.state + '">' + ARCH + LANT + (w.state === 'missed' ? '<i class="smoke"></i>' : '') +
      '<span class="bay-n">' + w.w + '</span><span class="bay-l">' + LBL[w.state] + '</span><span class="bay-d">' + A.fmtShort(A.weekStart(w.w)) + ' – ' + A.fmtShort(A.weekEnd(w.w)) + '</span></div>';
  }).join('');
  var n = counts(C);
  $('#arcStats').innerHTML = '<div class="ss"><b>' + n.dev + '</b>قناديل مضاءة</div><div class="ss burn"><b>' + n.burn + '</b>انطفأ</div><div class="ss"><b>' + n.left + '</b>باقية أمامك</div><div class="ss"><b>' + C.streak + '</b>أسابيع متتالية في وقتها</div>';
}

/* ---------------- eight goal tiles ---------------- */
function frac(ids) { var d = 0; ids.forEach(function (id) { var t = A.ALL.filter(function (x) { return x.id === id; })[0]; if (t && A.stat(t) === 'done') d++; }); return ids.length ? d / ids.length : 0; }
function checkWeeks(id, C) { var n = 0; for (var k = 1; k <= C.studyWeeksSoFar; k++) if (A.get('c:' + k + ':' + id, false)) n++; return n; }
function goals(C) {
  var so = Math.max(1, C.studyWeeksSoFar), w = curWeek(C), chPct = function (id) { var x = C.chs.filter(function (y) { return y.ch.id === id; })[0]; return x ? x.pct / 100 : 0; };
  var en = checkWeeks('en', C), sp = checkWeeks('sport', C), mk = checkWeeks('market', C);
  return [
    { ico: '📚', t: 'التركيز على دراستي', d: 'ساعات أسبوعية تحسبها هنا، وأسبوع الامتحان يُحفظ إطاره.', p: C.studyWeeksMet / so, st: A.hours(w) + ' / ' + A.studyGoal() + ' ساعة', go: '#studiesSec', g: '#2E8B7A' },
    { ico: '🎬', t: 'تعلّم DaVinci Resolve', d: 'التدريب الرسمي، ثم مونتاج 60 ثانية، ثم عرض المقال المصوّر.', p: frac(['c4', 'c6', 'd5']), st: 'القوس الثالث', go: 'C3', g: '#C8674F' },
    { ico: '🗣', t: 'تحسين لغتي الإنجليزية', d: '3 جلسات أسبوعيًا، ودروس إنجليزية، وتعليقات صورك بالإنجليزية.', p: en / so, st: en + ' من ' + so + ' أسابيع', go: '#checks', g: '#3F6FB8' },
    { ico: '📷', t: 'العودة لمحتوى هادف', d: 'صورة تعرف لماذا وُجدت — حتى المقال المصوّر في النهاية.', p: (chPct('C1') + chPct('C2') + chPct('C4')) / 3, st: 'الأقواس 1 و2 و4', go: 'C4', g: '#D4AF37' },
    { ico: '📣', t: 'تسويق نفسي', d: 'صفحة أعمال ونبذة بالعربية والإنجليزية، ونشر أسبوعي.', p: frac(['d6', 'd9']) * .6 + (mk / so) * .4, st: mk + ' أسابيع نشر', go: 'C4', g: '#7B5EA7' },
    { ico: '💪', t: 'لجسدك عليك حق', d: '«إنّ لجسدك عليك حقًّا» — كما كتبتَ. رياضة مرتين كل أسبوع.', p: sp / so, st: sp + ' من ' + so + ' أسابيع', go: '#checks', g: '#3FA796' },
    { ico: '💼', t: 'دخل أفضل — بلا ضغط عمل', d: 'العمل مع العملاء وصفحة الأعمال: أول خطوة نحو دخل من عمل تحبّه.', p: frac(['d9', 'd6']), st: 'القوس الرابع', go: 'C4', g: '#B8865B' },
    { ico: '🎓', t: 'تدريب المدرّبين TOT معتمد', d: 'هدف ما بعد هذا الموسم — نختار البرنامج المعتمد معًا في يناير.', p: C.allDone ? .3 : 0, st: 'يناير 2027', go: '#library', g: '#5C7FB0' }
  ];
}
function paintTiles(C) {
  var el = $('#tiles'); if (!el) return;
  el.innerHTML = goals(C).map(function (g, i) {
    var p = Math.max(0, Math.min(1, g.p)), y = (100 - p * 100).toFixed(1);
    return '<a class="tile" href="' + (g.go.charAt(0) === '#' ? g.go : '#ch-' + g.go) + '" data-go="' + g.go + '">' +
      '<div class="tile-star"><svg viewBox="0 0 100 100"><defs><clipPath id="tc' + i + '"><path d="' + STAR + '"/></clipPath></defs>' +
      '<path d="' + STAR + '" fill="#0E1A31" stroke="#D4AF37" stroke-width="2"/>' +
      '<g clip-path="url(#tc' + i + ')"><rect class="fillr" x="0" y="' + y + '" width="100" height="' + (p * 100).toFixed(1) + '" fill="' + g.g + '"/></g>' +
      '<path d="' + STAR + '" fill="none" stroke="#F3D98A" stroke-width="1.2" transform="scale(.7) translate(21.4 21.4)" opacity=".7"/></svg><span class="ico">' + g.ico + '</span></div>' +
      '<h4>' + A.esc(g.t) + '</h4><p>' + A.esc(g.d) + '</p><span class="st">' + A.esc(g.st) + '</span><div class="bar"><i style="width:' + Math.round(p * 100) + '%"></i></div><span class="where">' + (p >= 1 ? 'اكتملت البلاطة ✓' : 'افتح في المسار ←') + '</span></a>';
  }).join('');
  el.querySelectorAll('[data-go]').forEach(function (a) { var g = a.getAttribute('data-go'); if (g.charAt(0) !== '#') a.addEventListener('click', function (e) { e.preventDefault(); A.openChapter(g); }); });
}

/* ---------------- pledge (he writes it, he keeps it) ---------------- */
function plInit() {
  var el = $('#pledge'); if (!el) return;
  el.innerHTML = '<h3>عهدي</h3><p>قلتَ إنك تعمل أفضل حين يكون هناك ما تخسره. فاختر بنفسك ما ستخسره إذا انطفأ قنديلان: صدقة تحدّد مبلغها، أو شيء تحبّه تتركه أسبوعًا. لا أحد يفرضه عليك.</p><div class="pl-verse">﴿وَأَوْفُوا بِالْعَهْدِ ۖ إِنَّ الْعَهْدَ كَانَ مَسْئُولًا﴾ <small style="font-family:Dahab;font-size:12px;color:var(--muted);font-weight:400">— الإسراء: 34</small></div><p>هذا عهدك مع نفسك، لا مع المشرف — ولهذا هو أثقل.</p>' +
    '<div id="plAlert" class="pl-alert hidden"></div>' +
    '<div id="plEdit" class="hidden"><textarea id="plIn" maxlength="300" placeholder="مثال: إذا انطفأ قنديلان، أتصدّق بـ… وأعوّض الأسبوع الضائع في عطلة نهاية الأسبوع."></textarea>' +
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
  if (due) al.textContent = 'انطفأ قنديلان. حان وقت الوفاء بعهدك — ثم نبدأ صفحة جديدة، بلا جلد للذات.';
  $('#plKept').classList.toggle('hidden', !due);
}

/* ---------------- the weekly dialogue ---------------- */
function tkInit() {
  var el = $('#talkCard'); if (!el) return;
  el.innerHTML = '<div class="talk-list" id="tkList"></div><div class="talk-lock hidden" id="tkLock"></div>' +
    '<div class="talk-form hidden" id="tkForm"><label for="tkIn" id="tkLbl">سطران لعبد الرحمن في ديسمبر</label>' +
    '<textarea id="tkIn" maxlength="500" placeholder="هذا الأسبوع خفتُ من… لكنني… وتعلّمت أن…"></textarea><div><button class="btn btn-main btn-sm" id="tkSave">أرسل لنفسي</button></div></div>';
  var inp = $('#tkIn');
  inp.addEventListener('input', function () { tkDirty = true; });
  $('#tkSave').addEventListener('click', function () {
    var v = inp.value.trim().slice(0, 500); if (!v) { inp.focus(); return; }
    var w = curWeek(A.computed()); tkDirty = false;
    A.burst($('#tkSave'), 20); A.set('talk:' + w, v);
    if (!A.get('c:' + w + ':talk', false)) A.set('c:' + w + ':talk', 1);
    A.toast('وصلت رسالتك لعبد الرحمن في ديسمبر ✉');
  });
}
function talkCount() { var n = 0; for (var k = 1; k <= T.weeks; k++) if (A.get('talk:' + k, '')) n++; return n; }
function paintTalk(C) {
  if (!$('#tkList')) return;
  var me = A.isMe(), mgr = A.isMgr(), w = curWeek(C), upto = C.week > T.weeks ? T.weeks : w;
  $('#tkForm').classList.toggle('hidden', !me);
  $('#tkList').classList.toggle('hidden', !me);
  var lock = $('#tkLock'); lock.classList.toggle('hidden', !mgr);
  if (mgr) lock.innerHTML = 'كتب عبد الرحمن لنفسه في <b>' + talkCount() + '</b> من ' + upto + ' أسابيع. الحوار له وحده — لا يُعرض هنا.';
  if (!me) return;
  var html = '';
  for (var k = 1; k <= upto; k++) {
    var t = A.get('talk:' + k, '');
    html += '<div class="tl"><span class="tl-w">WEEK ' + k + '</span><div class="bub me-now' + (t ? '' : ' empty') + '"><small>أنا · الأسبوع ' + k + '</small><p>' + (t ? A.esc(t) : 'لم يُكتب بعد') + '</p></div></div>';
  }
  if (C.allDone || C.week > T.weeks) html += '<div class="tl"><div class="bub me-then"><small>أنا · ديسمبر</small><p>قرأتُ كل ما كتبتَه. الآن دوري في الردّ — في مهمة «الحوار الثاني».</p></div></div>';
  $('#tkList').innerHTML = html;
  setText('tkLbl', 'سطران لعبد الرحمن في ديسمبر — الأسبوع ' + w);
  var inp = $('#tkIn'); if (!tkDirty && document.activeElement !== inp) inp.value = A.get('talk:' + w, '');
}

/* ---------------- hooks ---------------- */
T.hooks = {
  init: function (api) { A = api; door(); geo(); rosetteInit(); plInit(); tkInit(); },
  render: function (C) { paintRosette(C); paintTiles(C); paintArcade(C); paintPledge(C); paintTalk(C); },
  managerExtra: function (C, api) {
    var n = counts(C), w = curWeek(C), habits = T.checks.filter(function (c) { return api.get('c:' + w + ':' + c.id, false); }).length, pl = api.get('pledge', '');
    return '<div class="mgr-extra">' +
      '<div class="mgr-box"><b>رواق الأسابيع</b>' + n.dev + ' مضاء · ' + n.burn + ' انطفأ · ' + n.left + ' باقٍ</div>' +
      '<div class="mgr-box"><b>عهده</b>' + (pl ? api.esc(pl) : 'لم يُكتب بعد') + '</div>' +
      '<div class="mgr-box"><b>حوار الأسابيع</b>' + talkCount() + ' رسالة (المحتوى خاص به)</div>' +
      '<div class="mgr-box"><b>عادات الأسبوع ' + w + '</b>' + habits + ' من ' + T.checks.length + '</div></div>';
  },
  celebration: function (ch) {
    return ({
      C1: { ico: '🏮', h: 'اكتمل القوس الأول', p: 'اكتمل فصل «النيّة». صورتك الآن تعرف لماذا وُجدت — وهذا ما لا تعرفه أي آلة.' },
      C2: { ico: '🤝', h: 'اكتمل القوس الثاني', p: 'اكتمل فصل «الكرامة والثقة». صوّرتَ الناس كما هم، لا كما تريدهم الكاميرا.' },
      C3: { ico: '📐', h: 'اكتمل القوس الثالث', p: 'اكتمل فصل «الزاوية». صرتَ تختار زاويتك بنيّة، وتبني قصتك في المونتاج.' },
      C4: { ico: '✦', h: 'اكتملت الدار', p: 'اكتمل المقال المصوّر والمسار كله. قناديلك تشهد على كل أسبوع وفيتَ فيه.' }
    })[ch.id] || { ico: '✦', h: 'اكتمل القوس', p: '' };
  }
};
})();
