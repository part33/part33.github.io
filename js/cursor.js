/* ============================================================================
   cursor.js — 像素准星光标 + 点击粒子拖尾
   ----------------------------------------------------------------------------
   只在"精确指针"（鼠标/触控板）且效果为 full 时才启用。
   触摸设备、减动效偏好、效果关闭 —— 三种情况一律不接管光标。
   ========================================================================= */
(function (LY) {
  'use strict';

  var host = document.documentElement;
  var el = null;

  var targetX = 0, targetY = 0;   /* 指针实时位置 */
  var drawX = 0, drawY = 0;       /* 准星当前位置（带缓动跟随） */
  var rafId = null;
  var active = false;             /* 停交互元素上时放大 */
  var seen = false;

  var LERP = 0.30;
  var PARTICLES = 9;

  function finePointer() {
    try {
      return window.matchMedia('(pointer: fine)').matches;
    } catch (e) {
      return false;
    }
  }

  function render() {
    if (!el) return;
    el.style.transform =
      'translate3d(' + drawX.toFixed(1) + 'px,' + drawY.toFixed(1) + 'px,0)' +
      ' scale(' + (active ? 1.65 : 1) + ')';
  }

  function loop() {
    drawX += (targetX - drawX) * LERP;
    drawY += (targetY - drawY) * LERP;
    render();

    if (Math.abs(targetX - drawX) > 0.3 || Math.abs(targetY - drawY) > 0.3) {
      rafId = window.requestAnimationFrame(loop);
    } else {
      drawX = targetX;
      drawY = targetY;
      render();
      rafId = null;
    }
  }

  function onMove(e) {
    targetX = e.clientX;
    targetY = e.clientY;

    if (!seen) {
      seen = true;
      drawX = targetX;
      drawY = targetY;
      el.classList.add('is-visible');
      render();
    }

    if (rafId === null) rafId = window.requestAnimationFrame(loop);
  }

  function isInteractive(node) {
    return !!(node && node.closest &&
      node.closest('a, button, summary, input, label, [role="button"]'));
  }

  function onOver(e) {
    var next = isInteractive(e.target);
    if (next === active) return;
    active = next;
    render();
  }

  function onLeave() {
    if (el) el.classList.remove('is-visible');
    seen = false;
  }

  /* 点击时向外迸出一圈像素方块 */
  function onDown(e) {
    if (!el || !el.animate) return;

    var x = e.clientX;
    var y = e.clientY;

    for (var i = 0; i < PARTICLES; i++) {
      (function (i) {
        var p = document.createElement('span');
        p.className = 'cursor-trail';
        document.body.appendChild(p);

        var angle = (Math.PI * 2 * i) / PARTICLES + Math.random() * 0.35;
        var dist = 16 + Math.random() * 30;
        var dx = Math.cos(angle) * dist;
        var dy = Math.sin(angle) * dist;

        var anim = p.animate([
          { transform: 'translate3d(' + x + 'px,' + y + 'px,0) scale(1)', opacity: 0.95 },
          { transform: 'translate3d(' + (x + dx) + 'px,' + (y + dy) + 'px,0) scale(0)', opacity: 0 }
        ], {
          duration: 440 + Math.random() * 240,
          easing: 'steps(5, end)',
          fill: 'forwards'
        });

        anim.onfinish = function () { p.remove(); };
      })(i);
    }
  }

  function enable() {
    if (el) return;
    if (LY.reduced || LY.effects.get() !== 'full' || !finePointer()) return;

    el = document.createElement('div');
    el.className = 'cursor';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<i></i><i></i><i></i><i></i>';
    document.body.appendChild(el);

    host.classList.add('has-pixel-cursor');
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerleave', onLeave, { passive: true });
  }

  function disable() {
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerover', onOver);
    document.removeEventListener('pointerdown', onDown);
    document.removeEventListener('pointerleave', onLeave);
    host.classList.remove('has-pixel-cursor');

    if (rafId !== null) { window.cancelAnimationFrame(rafId); rafId = null; }
    if (el) { el.remove(); el = null; }
    active = false;
    seen = false;
  }

  LY.cursor = {
    init: function () {
      enable();
      LY.effects.onChange(function (level) {
        if (level === 'full' && !LY.reduced) enable();
        else disable();
      });
    }
  };

})(window.LY = window.LY || {});
