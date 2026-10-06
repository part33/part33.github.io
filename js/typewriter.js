/* ============================================================================
   typewriter.js — 打字机
   ----------------------------------------------------------------------------
   元素在 HTML 里已经有完整文本（所以禁用 JS 也能读），
   进入视口时才清空并逐字打出来，不打乱 SEO 与无障碍。
   标点后会多停一拍，读起来像真人在敲。
   ========================================================================= */
(function (LY) {
  'use strict';

  var PUNCT = /[，。！？、；：,.!?;:—…]/;
  var observers = [];

  function type(el) {
    var full = el.getAttribute('data-type');
    if (!full) {
      /* 从 HTML 文本回退，并把换行/多余空白压平 */
      full = (el.textContent || '').replace(/\s+/g, ' ').trim();
      el.setAttribute('data-type', full);
    }
    if (!full) return;

    var i = 0;
    el.textContent = '';
    el.classList.add('is-typing');

    function step() {
      i += 1;
      el.textContent = full.slice(0, i);

      if (i >= full.length) {
        el.classList.remove('is-typing');
        return;
      }

      var ch = full.charAt(i - 1);
      var delay = 42 + Math.random() * 58;
      if (PUNCT.test(ch)) delay += 280;

      window.setTimeout(step, delay);
    }

    window.setTimeout(step, 160);
  }

  LY.typewriter = {
    init: function () {
      var els = document.querySelectorAll('[data-type]');
      if (!els.length) return;

      /* 减动效或效果关闭时，保持 HTML 里的原始文本即可 —— 不做任何事 */
      if (LY.reduced || LY.effects.get() === 'off') return;

      if (!('IntersectionObserver' in window)) {
        Array.prototype.forEach.call(els, type);
        return;
      }

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          type(entry.target);
        });
      }, { threshold: 0.45 });

      Array.prototype.forEach.call(els, function (el) { io.observe(el); });
      observers.push(io);
    }
  };

})(window.LY = window.LY || {});
