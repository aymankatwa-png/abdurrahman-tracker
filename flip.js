/* ============================================================
   صفحات قديمة — when the diwan opens, old stained pages flip by
   fast (dark red ink), then the last clean page lands and his
   name is written on it. A reminder that only he will read.
   Pages bend as they turn: each leaf is a chain of thin strips,
   and light and shadow follow the bend.
   ============================================================ */
(function () {
'use strict';
var TEX = ['assets/flip/s1.webp', 'assets/flip/s6.webp', 'assets/flip/s3.webp', 'assets/flip/s8.webp', 'assets/flip/s5.webp', 'assets/flip/s2.webp', 'assets/flip/s7.webp', 'assets/flip/s4.webp'];
var V = '?v=1';
var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
var STRIPS = 16;

/* preload now, so the textures are ready when the book opens */
var loaded = TEX.map(function (src) { return new Promise(function (res) { var i = new Image(); i.onload = i.onerror = function () { res(); }; i.src = src + V; }); });

function ease(p) { return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }

function run(done) {
  var book = document.getElementById('book'), hero = document.getElementById('hero');
  var pr = document.getElementById('pageR'), pl = book && book.querySelector('.page-l');
  if (reduce || !book || !pr || !pl) return done();
  /* reopened lower down the page? do not play out of sight */
  var hb = hero.getBoundingClientRect(); if (hb.bottom < 120 || hb.top > innerHeight - 120) return done();

  var bb = book.getBoundingClientRect(), rr = pr.getBoundingClientRect(), lr = pl.getBoundingClientRect();
  var two = lr.right <= rr.left + 2 && Math.abs(lr.top - rr.top) < 4;
  /* the area the leaves sit on: the left page (spread) or the first page (phone) */
  var leafBox = two ? { x: lr.left - bb.left, y: lr.top - bb.top, w: lr.width, h: lr.height }
                    : { x: rr.left - bb.left, y: rr.top - bb.top, w: rr.width, h: rr.height };
  var fl = document.createElement('div'); fl.className = 'flip' + (two ? ' two' : ' one'); fl.setAttribute('aria-hidden', 'true');

  /* bases: what lies under the leaves */
  var baseL = document.createElement('div'); baseL.className = 'fl-base clean ' + (two ? 'side-l' : 'side-one');
  place(baseL, leafBox); fl.appendChild(baseL);
  if (two) { var baseR = document.createElement('div'); baseR.className = 'fl-base stained side-r';
    place(baseR, { x: rr.left - bb.left, y: rr.top - bb.top, w: rr.width, h: rr.height });
    baseR.style.backgroundImage = 'url(' + TEX[7] + V + ')'; fl.appendChild(baseR); }

  /* the clean last page carries the same thin double frame as the real page — drawn once across the whole leaf */
  var ins = innerWidth <= 640 ? 9 : 16, fw = leafBox.w, fh = leafBox.h;
  var frameURL = "url('data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="' + fw + '" height="' + fh + '"><rect x="' + (ins + .5) + '" y="' + (ins + .5) + '" width="' + (fw - 2 * ins - 1) + '" height="' + (fh - 2 * ins - 1) + '" rx="2" fill="none" stroke="rgba(168,50,42,.28)"/><rect x="' + (ins - 4.5) + '" y="' + (ins - 4.5) + '" width="' + (fw - 2 * ins + 9) + '" height="' + (fh - 2 * ins + 9) + '" fill="none" stroke="rgba(168,50,42,.14)"/></svg>') + "')";

  /* leaves: pages that flip */
  var N = two ? 8 : 7, leaves = [];
  var gaps = [0, .2, .15, .12, .095, .08, .075, .085], durs = [.62, .56, .5, .46, .43, .42, .44, .66];
  if (!two) { gaps = [0, .19, .14, .11, .09, .08, .09]; durs = [.58, .52, .47, .44, .42, .44, .62]; }
  var t = 0;
  for (var i = 0; i < N; i++) {
    t += gaps[i];
    var last = i === N - 1;
    var lf = document.createElement('div'); lf.className = 'fl-leaf'; place(lf, leafBox);
    var front = TEX[i % TEX.length], back = last ? null : TEX[(i + 4) % TEX.length];
    var NS = two ? STRIPS : 9, parent = lf, strips = [], sw = leafBox.w / NS;
    /* strip 0 sits at the spine (right edge); each next strip hangs to its left */
    for (var k = 0; k < NS; k++) {
      var s = document.createElement('div'); s.className = 'fl-strip';
      s.style.width = (sw + 1.2) + 'px'; s.style.height = leafBox.h + 'px';
      s.style.left = (k === 0 ? leafBox.w - sw : -sw) + 'px';
      var fx = -(NS - 1 - k) * sw, bxp = -k * sw; /* texture offsets for front / mirrored back */
      var bs = 'background-size:' + leafBox.w + 'px ' + leafBox.h + 'px;';
      s.innerHTML = '<i class="fc f' + (k === NS - 1 ? ' edge' : '') + '" style="background-image:url(' + front + V + ');' + bs + 'background-position:' + fx + 'px 0"></i>' +
        (back ? '<i class="fc b" style="background-image:url(' + back + V + ');' + bs + 'background-position:' + bxp + 'px 0"></i>'
              : '<i class="fc b clean" style="background-image:' + frameURL + ',var(--grain);background-size:' + leafBox.w + 'px ' + leafBox.h + 'px,220px 220px;background-position:' + bxp + 'px 0,' + bxp + 'px 0;background-repeat:no-repeat,repeat"></i>');
      parent.appendChild(s); strips.push(s); parent = s;
    }
    if (last && two) lf.classList.add('last');
    fl.appendChild(lf);
    leaves.push({ el: lf, strips: strips, t0: t, d: durs[i], z0: N - i, z1: i + 1, last: last });
  }
  book.appendChild(fl);
  hero.classList.add('flipping');

  var speed = 1, finished = false, clock = 0, prev = null;
  var hurry = function () { speed = 3.2; };
  ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(function (e) { addEventListener(e, hurry, { passive: true, once: true }); });

  function frame(now) {
    if (prev == null) prev = now;
    clock += Math.min(.05, (now - prev) / 1000) * speed; prev = now;
    var t1 = clock - .25, all = true; /* .25s: the open book settles first */
    leaves.forEach(function (L) {
      var p = Math.max(0, Math.min(1, (t1 - L.t0) / L.d)); if (p < 1) all = false;
      var e = ease(p), A = 180 * e;
      var bend = Math.sin(2 * Math.PI * p) * (L.last ? 8 : 12) * (p < .5 ? 1 : .65); /* the free edge leads as it lifts, then trails as it falls */
      var z = L.z0 + (L.z1 - L.z0) * e;
      L.el.style.transform = 'translateZ(' + (z * .6).toFixed(2) + 'px)';
      var acc = 0, S = L.strips.length, norm = S * (S - 1) / 2, sh = [];
      for (var k = 0; k < S; k++) {
        var a = k === 0 ? Math.max(0, Math.min(180, A - bend * 1.2)) : bend * 4.5 * k / norm; /* curl grows toward the free edge */
        acc += a; L.strips[k].style.transform = 'rotateY(' + a.toFixed(2) + 'deg)';
        sh.push(Math.abs(Math.sin(acc * Math.PI / 180)) * .34); /* light: bright when flat, darker edge-on */
      }
      for (k = 0; k < S; k++) {
        var r = (sh[k] + sh[Math.max(0, k - 1)]) / 2, l = (sh[k] + sh[Math.min(S - 1, k + 1)]) / 2;
        L.strips[k].style.setProperty('--l', l.toFixed(3)); L.strips[k].style.setProperty('--r', r.toFixed(3));
      }
      if (!two && p >= 1 && !L.gone) { L.gone = true; L.el.style.opacity = 0; }
    });
    if (all && !finished) { finished = true; finish(); return; }
    requestAnimationFrame(frame);
  }
  function finish() {
    removeEventListener('wheel', hurry); removeEventListener('touchstart', hurry); removeEventListener('pointerdown', hurry); removeEventListener('keydown', hurry);
    hero.classList.remove('flipping'); hero.classList.add('flipped');
    done();
    /* the real pages are now in place under the last leaf: lift the overlay away */
    requestAnimationFrame(function () { fl.classList.add('out'); setTimeout(function () { fl.remove(); }, 450); });
  }
  Promise.race([Promise.all(loaded), new Promise(function (r) { setTimeout(r, 1200); })]).then(function () {
    fl.classList.add('in'); requestAnimationFrame(frame);
  });
}
function place(el, b) { el.style.left = b.x + 'px'; el.style.top = b.y + 'px'; el.style.width = b.w + 'px'; el.style.height = b.h + 'px'; }

/* wait until the role picker is closed, so he sees it */
window.DIWAN_FLIP = function (done) {
  var vp = document.getElementById('rolePicker');
  if (vp && !vp.classList.contains('hidden')) {
    var mo = new MutationObserver(function () { if (vp.classList.contains('hidden')) { mo.disconnect(); setTimeout(function () { run(done); }, 250); } });
    mo.observe(vp, { attributes: true, attributeFilter: ['class'] });
  } else run(done);
};
})();
