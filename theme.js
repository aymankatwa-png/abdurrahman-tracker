/* ============================================================
   أنا أحدّث أنا — the look and the darkroom tools
   (safelight, developing print, contact sheet with burned frames,
    his own pledge, the weekly dialogue with himself)
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

/* ---------------- safelight follows the hand ---------------- */
function safelight() {
  var h = $('#hero'); if (!h || reduce) return;
  h.addEventListener('pointermove', function (e) {
    var r = h.getBoundingClientRect();
    h.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
    h.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
  });
}

/* ---------------- contact sheet ---------------- */
var LBL = { future: 'لم يُعرَّض بعد', now: 'يُعرَّض الآن', ok: 'تحمّض', exam: 'محفوظ · امتحانات', late: 'تحمّض متأخرًا', missed: 'احترق' };
function counts(C) {
  var o = { dev: 0, burn: 0, left: 0 };
  C.weeksInfo.forEach(function (w) { if (w.state === 'missed') o.burn++; else if (w.state === 'future' || w.state === 'now') o.left++; else o.dev++; });
  return o;
}
function paintFilm(C) {
  var el = $('#film'); if (!el) return;
  el.innerHTML = C.weeksInfo.map(function (w) {
    var k = w.w, pos = ((k * 37) % 90 + 5) + '% ' + ((k * 23) % 50 + 10) + '%';
    return '<div class="fr ' + w.state + '" title="الأسبوع ' + k + '"><div class="fr-img" style="background-image:url(assets/sticker-sm.webp);background-position:' + pos + '"></div>' +
      '<span class="fr-n">' + k + 'A</span><div class="fr-l">' + LBL[w.state] + '<small><bdi dir="ltr">' + A.fmtShort(A.weekStart(k)) + ' – ' + A.fmtShort(A.weekEnd(k)) + '</bdi></small></div></div>';
  }).join('');
  var n = counts(C);
  $('#sheetStats').innerHTML = '<div class="ss"><b>' + n.dev + '</b>إطارات تحمّضت</div><div class="ss burn"><b>' + n.burn + '</b>احترق</div><div class="ss"><b>' + n.left + '</b>باقية أمامك</div><div class="ss"><b>' + C.streak + '</b>أسابيع متتالية في وقتها</div>';
}

/* ---------------- pledge (he writes it, he keeps it) ---------------- */
function plInit() {
  var el = $('#pledge'); if (!el) return;
  el.innerHTML = '<h3>ميثاقي</h3><p>ما الذي ستخسره إذا احترق إطاران؟ أنت تختاره: صدقة تحدّد مبلغها، أو شيء تحبّه تتركه أسبوعًا. لا أحد يفرضه عليك — لكنك ستفي به.</p>' +
    '<div id="plAlert" class="pl-alert hidden"></div>' +
    '<div id="plEdit" class="hidden"><textarea id="plIn" maxlength="300" placeholder="مثال: إذا احترق إطاران، أتصدّق بـ… وأعوّض الأسبوع الضائع في عطلة نهاية الأسبوع."></textarea>' +
    '<div class="pl-row" style="margin-top:8px"><button class="btn btn-main btn-sm" id="plSave">حفظ الميثاق</button><button class="btn btn-ghost btn-sm hidden" id="plKept">وفيتُ بالميثاق ✓</button></div></div>' +
    '<div id="plShow" class="pl-show hidden"></div>';
  var inp = $('#plIn');
  inp.addEventListener('input', function () { plDirty = true; });
  $('#plSave').addEventListener('click', function () {
    var v = inp.value.trim().slice(0, 300); plDirty = false;
    A.burst($('#plSave'), 18); A.set('pledge', v);
    A.toast(v ? 'كُتب الميثاق — الكلمة كلمتك' : 'حُذف الميثاق');
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
  show.textContent = v ? '«' + v + '»' : 'لم يُكتب الميثاق بعد.';
  if (me && !v) show.classList.add('hidden');
  var al = $('#plAlert'); al.classList.toggle('hidden', !due);
  if (due) al.textContent = 'احترق إطاران. حان وقت الوفاء بميثاقك — ثم نبدأ صفحة جديدة، بلا جلد للذات.';
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

/* ---------------- hero: dialogue + developing print ---------------- */
function paintHero(C) {
  var p = C.pct / 100, img = $('#printImg');
  if (img) img.style.filter = 'brightness(' + (.12 + .88 * p).toFixed(2) + ') contrast(' + (.6 + .4 * p).toFixed(2) + ') grayscale(' + (1 - p * p).toFixed(2) + ')';
  setText('trayPct', C.pct + '%');
  setText('printLbl', C.pct >= 100 ? 'تحمّضت الصورة' : 'الصورة تتحمّض');
  if (A.isMe()) {
    var last = ''; for (var k = T.weeks; k >= 1; k--) { last = A.get('talk:' + k, ''); if (last) break; }
    if (last) setText('tNow', last.length > 150 ? last.slice(0, 150) + '…' : last);
  }
  if (C.allDone) setText('tThen', 'قرأتُ كل ما كتبت. وصلتَ — وبطريقتك أنت.');
}

/* ---------------- hooks ---------------- */
T.hooks = {
  init: function (api) { A = api; safelight(); plInit(); tkInit(); },
  render: function (C) { paintHero(C); paintFilm(C); paintPledge(C); paintTalk(C); },
  managerExtra: function (C, api) {
    var n = counts(C), w = curWeek(C), habits = T.checks.filter(function (c) { return api.get('c:' + w + ':' + c.id, false); }).length, pl = api.get('pledge', '');
    return '<div class="mgr-extra">' +
      '<div class="mgr-box"><b>شريط الأسابيع</b>' + n.dev + ' تحمّض · ' + n.burn + ' احترق · ' + n.left + ' باقٍ</div>' +
      '<div class="mgr-box"><b>ميثاقه</b>' + (pl ? api.esc(pl) : 'لم يُكتب بعد') + '</div>' +
      '<div class="mgr-box"><b>حوار الأسابيع</b>' + talkCount() + ' رسالة (المحتوى خاص به)</div>' +
      '<div class="mgr-box"><b>عادات الأسبوع ' + w + '</b>' + habits + ' من ' + T.checks.length + '</div></div>';
  },
  celebration: function (ch) {
    return ({
      C1: { ico: '🎞', h: 'تحمّض الفيلم الأول', p: 'اكتمل فصل «النيّة». صورتك الآن تعرف لماذا وُجدت — وهذا ما لا تعرفه أي آلة.' },
      C2: { ico: '🤝', h: 'تحمّض الفيلم الثاني', p: 'اكتمل فصل «الكرامة والثقة». صوّرتَ الناس كما هم، لا كما تريدهم الكاميرا.' },
      C3: { ico: '📐', h: 'تحمّض الفيلم الثالث', p: 'اكتمل فصل «الزاوية». صرتَ تختار زاويتك بنيّة، وتبني قصتك في المونتاج.' },
      C4: { ico: '🖼', h: 'تحمّضت الصورة كاملة', p: 'اكتمل المقال المصوّر والمسار كله. هذا أنت — بلا نسخة من أحد.' }
    })[ch.id] || { ico: '✓', h: 'اكتمل الفصل', p: '' };
  }
};
})();
