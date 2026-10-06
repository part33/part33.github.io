/* ============================================================================
   scroll.js — 滚动进度 / 刻度轨道 / 入场渲染 / 锚点跳转
   ========================================================================= */
(function (LY) {
  'use strict';

  var progFill = null;
  var hudBottom = 60;
  var sections = [];
  var currentId = null;
  var queued = false;

  /* -------------------------------------------------------------------------
     进度：用 scaleX 而不是 width，避免每帧触发布局
     ------------------------------------------------------------------------- */
  function updateProgress() {
    if (!progFill) return;
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? window.scrollY / max : 0;
    p = p < 0 ? 0 : (p > 1 ? 1 : p);
    progFill.style.transform = 'scaleX(' + p.toFixed(4) + ')';
  }

  /* -------------------------------------------------------------------------
     刻度轨道：找出"当前停在"哪一节。
     判据是"top 已经越过 HUD 底部"的最后一节，比 IntersectionObserver
     在长页面上更稳（不会出现两节同时亮）
     ------------------------------------------------------------------------- */
  function updateRail() {
    if (!sections.length) return;

    var found = sections[0];
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].el.getBoundingClientRect().top <= hudBottom + 8) found = sections[i];
    }
    if (found.id === currentId) return;

    currentId = found.id;
    sections.forEach(function (s) {
      s.tick.classList.toggle('is-on', s.id === currentId);
    });
  }

  function frame() {
    queued = false;
    updateProgress();
    updateRail();
  }

  function onScroll() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(frame);
  }

  /* -------------------------------------------------------------------------
     入场渲染
     确认 JS 与 IntersectionObserver 都可用之后，才敢把内容先隐藏起来，
     否则脚本一挂，整页内容就永久不可见了
     ------------------------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (LY.reduced || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('is-in'); });
      return;
    }

    document.documentElement.classList.add('anim-ready');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -6% 0px' });

    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  }

  function measure() {
    var hud = document.querySelector('.hud');
    hudBottom = hud ? hud.getBoundingClientRect().bottom : 60;
  }

  LY.scroll = {
    /* 供终端 open <分节> 调用 */
    goTo: function (id) {
      var el = document.getElementById(id);
      if (!el) return false;
      el.scrollIntoView({ behavior: LY.reduced ? 'auto' : 'smooth', block: 'start' });
      return true;
    },

    init: function () {
      progFill = document.getElementById('prog');

      var rail = document.querySelector('.rail');
      if (rail) {
        Array.prototype.forEach.call(rail.querySelectorAll('.rail__tick'), function (tick) {
          var id = tick.getAttribute('data-rail');
          var el = document.getElementById(id);
          if (el) sections.push({ id: id, el: el, tick: tick });
        });
      }

      measure();
      initReveal();
      onScroll();

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', function () {
        measure();
        onScroll();
      }, { passive: true });
    }
  };

})(window.LY = window.LY || {});
