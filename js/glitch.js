/* ============================================================================
   glitch.js — 标题故障效果
   ----------------------------------------------------------------------------
   不做常驻抖动（那会让人烦躁且伤可读性），
   而是每隔 4~11 秒随机爆发 320ms，像一次信号干扰。
   ========================================================================= */
(function (LY) {
  'use strict';

  var targets = [];
  var timer = null;
  var running = false;

  function burst() {
    if (!targets.length) return;
    targets.forEach(function (el) { el.classList.add('is-on'); });
    window.setTimeout(function () {
      targets.forEach(function (el) { el.classList.remove('is-on'); });
    }, 340);
  }

  function stop() {
    running = false;
    if (timer) { window.clearTimeout(timer); timer = null; }
    targets.forEach(function (el) { el.classList.remove('is-on'); });
  }

  function tick() {
    if (!running) return;
    burst();
    timer = window.setTimeout(tick, 4200 + Math.random() * 7000);
  }

  function start() {
    if (running || !targets.length || LY.reduced) return;
    if (LY.effects.get() !== 'full') return;
    running = true;
    /* 第一次爆发稍微晚一点，正好落在开机序列结束、画面刚亮起的时候 */
    timer = window.setTimeout(tick, 900);
  }

  LY.glitch = {
    init: function () {
      targets = Array.prototype.slice.call(document.querySelectorAll('.glitch'));

      LY.effects.onChange(function () {
        if (LY.effects.get() === 'full' && !LY.reduced) start();
        else stop();
      });

      start();
    },

    /* 供终端等模块手动触发一次 */
    burst: burst
  };

})(window.LY = window.LY || {});
