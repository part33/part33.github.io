/* ============================================================================
   boot.js — 开机序列
   ----------------------------------------------------------------------------
   整站唯一的"编排过的动效"：一次性、可跳过、只播一次（sessionStorage）。
   想强制重播：在网址后加 ?boot=1
   ========================================================================= */
(function (LY) {
  'use strict';

  var root = document.documentElement;

  var overlay = null;
  var logEl = null;
  var onDone = null;

  var finished = false;
  var timers = [];

  var LABEL_WIDTH = 30;
  var SKIP_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart'];

  function later(fn, ms) {
    timers.push(window.setTimeout(fn, ms));
  }

  function clearTimers() {
    timers.forEach(window.clearTimeout);
    timers = [];
  }

  /* label 后面用点号补齐，像 BIOS 自检那样对齐 */
  function padded(label) {
    var need = Math.max(2, LABEL_WIDTH - label.length);
    return label + ' ' + new Array(need + 1).join('.') + ' ';
  }

  function addLine(item) {
    if (!logEl) return;

    var row = document.createElement('div');
    row.className = 'boot__line';

    var label = document.createElement('span');
    label.textContent = padded(item.label);
    row.appendChild(label);

    var value = document.createElement('span');
    value.className = item.ok ? 'boot__ok' : (item.warn ? 'boot__warn' : 'boot__cur');
    value.textContent = item.value;
    row.appendChild(value);

    logEl.appendChild(row);
  }

  function removeSkipListeners() {
    SKIP_EVENTS.forEach(function (name) {
      window.removeEventListener(name, finish);
    });
  }

  function finish() {
    if (finished) return;
    finished = true;

    clearTimers();
    removeSkipListeners();

    var instant = LY.reduced === true;

    if (overlay) overlay.classList.add('is-done');

    /* 让它闪一下再收起 —— 这一下是"电视机通电"的收束感 */
    later(function () {
      if (overlay) overlay.setAttribute('hidden', '');
      root.classList.remove('is-locked');

      try { sessionStorage.setItem('ly.booted', '1'); } catch (e) {}

      if (typeof onDone === 'function') onDone();
    }, instant ? 0 : 420);
  }

  function run(done) {
    onDone = done;

    overlay = document.getElementById('boot');
    logEl = document.getElementById('boot-log');

    if (!overlay || !logEl) {
      if (typeof done === 'function') done();
      return;
    }

    /* 三种情况直接跳过：本次会话已播过 / 用户要求减动效 / 效果被关掉 */
    var skip = root.classList.contains('no-boot') ||
               LY.reduced === true ||
               LY.effects.get() === 'off';

    if (skip) {
      finished = true;
      overlay.setAttribute('hidden', '');
      logEl.textContent = '';
      if (typeof done === 'function') done();
      return;
    }

    root.classList.add('is-locked');

    var i = 0;

    function step() {
      if (finished) return;

      if (i >= LY.BOOT.length) {
        /* 全部打完，停一拍让人看清 */
        later(finish, 460);
        return;
      }

      addLine(LY.BOOT[i]);
      i += 1;
      later(step, 85 + Math.random() * 105);
    }

    step();

    /* 任何输入都能跳过 */
    SKIP_EVENTS.forEach(function (name) {
      window.addEventListener(name, finish, { passive: true });
    });
  }

  LY.boot = { run: run, finish: finish };

})(window.LY = window.LY || {});
