/* ============================================================================
   effects.js — 效果强度管理 / HUD 时钟 / 后台暂停
   ----------------------------------------------------------------------------
   强度三级：full（全效）/ low（只留静态质感）/ off（全关）
   初始值由 <head> 里的内联脚本算出（URL 参数 > localStorage > 默认），
   这里只负责读取、切换与广播。
   ========================================================================= */
(function (LY) {
  'use strict';

  var root = document.documentElement;
  var LEVELS = ['full', 'low', 'off'];
  var STORE_KEY = 'ly.fx';

  /* 系统级"减少动态效果"偏好 —— 所有动效模块都要先问它 */
  LY.reduced = false;
  try {
    LY.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { /* 老浏览器：当作 false */ }

  /* 监听系统偏好的实时变化 */
  try {
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function (e) {
      LY.reduced = e.matches;
    });
  } catch (e) { /* Safari < 14 只支持 addListener，忽略即可 */ }

  var level = root.getAttribute('data-fx');
  if (LEVELS.indexOf(level) === -1) level = LY.reduced ? 'low' : 'full';
  root.setAttribute('data-fx', level);

  var listeners = [];

  function persist(v) {
    try { localStorage.setItem(STORE_KEY, v); } catch (e) {}
  }

  function apply(next, save) {
    if (LEVELS.indexOf(next) === -1) return;
    level = next;
    root.setAttribute('data-fx', level);
    if (save) persist(level);
    listeners.forEach(function (fn) {
      try { fn(level); } catch (e) { /* 单个订阅者出错不影响其他 */ }
    });
  }

  /* -------------------------------------------------------------------------
     时钟 —— 固定按 UTC+8 显示，不管访客在哪个时区，
     因为这里写的是"我的当地时间"，时区飘了就没意义了
     ------------------------------------------------------------------------- */
  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function startClock() {
    var el = document.getElementById('clock');
    if (!el) return;

    function tick() {
      var now = new Date();
      var cn = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + 8 * 3600000);
      el.textContent =
        pad2(cn.getUTCHours()) + ':' +
        pad2(cn.getUTCMinutes()) + ':' +
        pad2(cn.getUTCSeconds());
    }

    tick();
    window.setInterval(tick, 1000);
  }

  /* -------------------------------------------------------------------------
     标签页切到后台时停掉动画，别空耗电
     ------------------------------------------------------------------------- */
  function watchVisibility() {
    function sync() {
      root.classList.toggle('is-hidden', document.hidden === true);
    }
    document.addEventListener('visibilitychange', sync);
    sync();
  }

  LY.effects = {
    get: function () { return level; },

    set: function (next) { apply(next, true); },

    cycle: function () {
      apply(LEVELS[(LEVELS.indexOf(level) + 1) % LEVELS.length], true);
      return level;
    },

    onChange: function (fn) { listeners.push(fn); },

    init: function () {
      var btn = document.getElementById('fx-btn');
      var txt = document.getElementById('fx-txt');

      function syncLabel() {
        if (txt) txt.textContent = level.toUpperCase();
        if (btn) btn.setAttribute('data-level', level);
      }

      listeners.push(syncLabel);
      syncLabel();

      if (btn) {
        btn.addEventListener('click', function () {
          var next = LY.effects.cycle();
          var label = { full: '全效', low: '弱化', off: '关闭' }[next] || next;
          if (LY.ui && LY.ui.toast) LY.ui.toast('CRT 效果：' + label);
        });
      }

      startClock();
      watchVisibility();
    }
  };

})(window.LY = window.LY || {});
