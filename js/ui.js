/* ============================================================================
   ui.js — 提示条 / 复制到剪贴板
   ========================================================================= */
(function (LY) {
  'use strict';

  var toastEl = null;
  var toastTimer = null;

  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-on');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.classList.remove('is-on');
    }, 1900);
  }

  /* -------------------------------------------------------------------------
     复制：优先用 Clipboard API；file:// 或非安全上下文下退回 execCommand
     ------------------------------------------------------------------------- */
  function legacyCopy(text) {
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.top = '-1000px';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand('copy');
        ta.remove();
        ok ? resolve() : reject(new Error('execCommand 返回 false'));
      } catch (err) {
        reject(err);
      }
    });
  }

  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text)['catch'](function () {
        return legacyCopy(text);
      });
    }
    return legacyCopy(text);
  }

  function initCopyButtons() {
    var buttons = document.querySelectorAll('.copy[data-copy]');

    Array.prototype.forEach.call(buttons, function (btn) {
      var original = btn.textContent;

      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-copy') || '';

        copy(text).then(function () {
          btn.textContent = 'COPIED';
          toast('已复制：' + text);
          window.setTimeout(function () { btn.textContent = original; }, 1500);
        })['catch'](function () {
          toast('复制失败，请手动选中');
        });
      });
    });
  }

  LY.ui = {
    toast: toast,

    init: function () {
      toastEl = document.getElementById('toast');
      initCopyButtons();
    }
  };

})(window.LY = window.LY || {});
