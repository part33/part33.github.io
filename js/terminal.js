/* ============================================================================
   terminal.js — 终端命令解释器
   ----------------------------------------------------------------------------
   设计取向：
   - 命令表放在 js/data.js，这里只负责解析、渲染、键盘交互 —— 加命令不用改这个文件
   - 打开时给主内容加 inert，焦点跑不出去；关闭后焦点回到原处
   - 输出用 role="log"，但"数字雨"这类刷屏会临时关掉 aria-live，免得读屏被炸
   ========================================================================= */
(function (LY) {
  'use strict';

  var root = document.documentElement;

  var modal = null, out = null, form = null, input = null;
  var inertTargets = [];

  var history = [];
  var hIndex = null;

  var lastFocus = null;
  var greeted = false;
  var rainTimer = null;

  var MAX_LINES = 400;
  var RAIN_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789$#@%&*+=?';

  /* -------------------------------------------------------------------------
     渲染
     ------------------------------------------------------------------------- */
  function makeLine(segments) {
    var row = document.createElement('div');
    row.className = 'term__line';

    segments.forEach(function (seg) {
      var span = document.createElement('span');
      span.className = 'term__line--' + (seg.c || 'out');
      span.textContent = seg.t == null ? '' : String(seg.t);
      row.appendChild(span);
    });

    return row;
  }

  /* 接受：字符串 | {t, c} | [{t, c}, ...]（数组 = 同一行的多个着色片段） */
  function normalize(payload) {
    if (payload == null) return null;

    if (typeof payload === 'string') {
      return [{ t: payload, c: 'out' }];
    }

    if (Object.prototype.toString.call(payload) === '[object Array]') {
      if (!payload.length) return [{ t: '', c: 'out' }];
      return payload.map(function (x) {
        if (typeof x === 'string') return { t: x, c: 'out' };
        return { t: x.t, c: x.c || 'out' };
      });
    }

    return [{ t: payload.t, c: payload.c || 'out' }];
  }

  function print(payload) {
    if (!out) return;
    var segments = normalize(payload);
    if (!segments) return;

    out.appendChild(makeLine(segments));

    /* 防止长时间会话把 DOM 撑爆 */
    while (out.childElementCount > MAX_LINES) out.removeChild(out.firstElementChild);

    scrollToEnd();
  }

  function scrollToEnd() {
    if (out) out.scrollTop = out.scrollHeight;
  }

  function clearOut() {
    if (out) out.textContent = '';
  }

  function setLive(mode) {
    if (out) out.setAttribute('aria-live', mode);
  }

  /* -------------------------------------------------------------------------
     数字雨彩蛋
     ------------------------------------------------------------------------- */
  function rain() {
    if (rainTimer) return;

    var rows = 11;
    var made = 0;
    setLive('off');

    rainTimer = window.setInterval(function () {
      if (made >= rows) {
        window.clearInterval(rainTimer);
        rainTimer = null;
        print({ t: '' });
        print({ t: 'The Matrix has you. 去 open work 看点真的东西。', c: 'ok' });
        print({ t: '' });
        setLive('polite');
        return;
      }

      var s = '';
      for (var i = 0; i < 48; i++) {
        s += RAIN_CHARS.charAt(Math.floor(Math.random() * RAIN_CHARS.length));
      }
      print({ t: s, c: 'ok' });
      made += 1;
    }, 60);
  }

  function stopRain() {
    if (rainTimer) {
      window.clearInterval(rainTimer);
      rainTimer = null;
      setLive('polite');
    }
  }

  /* -------------------------------------------------------------------------
     命令执行
     ------------------------------------------------------------------------- */
  function io(arg) {
    return {
      arg: arg,
      print: print,
      clear: clearOut,
      rain: rain,
      close: close,
      open: function (id) {
        close();
        if (LY.scroll) LY.scroll.goTo(id);
      }
    };
  }

  function runCommand(raw) {
    var text = String(raw || '').trim();

    if (!text) return;

    print([
      { t: 'guest@linyan:~$ ', c: 'dim' },
      { t: text, c: 'in' }
    ]);

    var parts = text.split(/\s+/);
    var name = parts[0].toLowerCase();
    var arg = parts.slice(1).join(' ');

    var cmd = LY.COMMANDS[name];

    if (!cmd) {
      print({ t: 'command not found: ' + name, c: 'err' });
      print({ t: '输入 help 看看有哪些命令。', c: 'dim' });
      return;
    }

    try {
      cmd.run(io(arg));
    } catch (err) {
      print({ t: '命令执行出错：' + (err && err.message ? err.message : err), c: 'err' });
    }

    scrollToEnd();
  }

  /* -------------------------------------------------------------------------
     历史记录 / Tab 补全
     ------------------------------------------------------------------------- */
  function pushHistory(text) {
    if (!text) return;
    if (history[history.length - 1] === text) return;
    history.push(text);
    if (history.length > 80) history.shift();
    hIndex = null;
  }

  function navHistory(dir) {
    if (!history.length) return;

    if (hIndex === null) {
      hIndex = dir < 0 ? history.length - 1 : history.length;
    } else {
      hIndex += dir;
    }

    if (hIndex < 0) hIndex = 0;

    if (hIndex > history.length - 1) {
      hIndex = null;
      input.value = '';
      return;
    }

    input.value = history[hIndex];
    try { input.setSelectionRange(input.value.length, input.value.length); } catch (e) {}
  }

  function complete() {
    var value = input.value;
    var match = value.match(/(?:^|\s)([a-z]*)$/i);

    if (!match) return;

    var frag = match[1].toLowerCase();
    var names = Object.keys(LY.COMMANDS);
    var hits = names.filter(function (n) { return n.indexOf(frag) === 0; });

    if (!hits.length) return;

    if (hits.length === 1) {
      input.value = value.slice(0, value.length - frag.length) + hits[0] + ' ';
    } else {
      print([
        { t: 'guest@linyan:~$ ', c: 'dim' },
        { t: value, c: 'in' }
      ]);
      print({ t: hits.join('   '), c: 'ok' });
    }
  }

  /* -------------------------------------------------------------------------
     开关
     ------------------------------------------------------------------------- */
  function setInert(on) {
    if (!inertTargets.length) {
      inertTargets = [
        document.getElementById('main'),
        document.querySelector('.hud'),
        document.querySelector('.rail'),
        document.querySelector('.skip-link')
      ].filter(Boolean);
    }

    inertTargets.forEach(function (node) {
      try {
        if (on) node.setAttribute('inert', '');
        else node.removeAttribute('inert');
      } catch (e) { /* 不支持 inert 时靠 Tab 陷阱兜底 */ }
    });
  }

  function greet() {
    print({ t: 'NYX-SHELL v3.1 — (c) 2026 ' + LY.SITE.name, c: 'dim' });
    print({ t: '' });
    print({ t: LY.SITE.name + '  ' + LY.SITE.handle, c: 'ok' });
    print({ t: LY.SITE.role + ' / ' + LY.SITE.roleEn, c: 'out' });
    print({ t: '“' + LY.SITE.tag + '”', c: 'dim' });
    print({ t: '' });
    print([
      { t: '输入 ', c: 'dim' },
      { t: 'help', c: 'ok' },
      { t: ' 看全部命令，', c: 'dim' },
      { t: 'open work', c: 'ok' },
      { t: ' 直接跳过分节。', c: 'dim' }
    ]);
    print({ t: '' });
  }

  function open() {
    if (!modal || !modal.hasAttribute('hidden')) return;

    lastFocus = document.activeElement;
    modal.removeAttribute('hidden');
    root.classList.add('is-locked');
    setInert(true);

    if (!greeted) {
      greeted = true;
      greet();
    }

    /* 等一帧再聚焦，保证过渡动画不会被滚动打断 */
    window.requestAnimationFrame(function () {
      if (input) input.focus();
    });
  }

  function close() {
    if (!modal || modal.hasAttribute('hidden')) return;

    stopRain();
    modal.setAttribute('hidden', '');
    root.classList.remove('is-locked');
    setInert(false);
    hIndex = null;

    if (lastFocus && lastFocus.focus) {
      /* preventScroll 很关键：否则关闭终端会把页面拽回触发按钮的位置 */
      try { lastFocus.focus({ preventScroll: true }); }
      catch (e) { lastFocus.focus(); }
    }
  }

  /* -------------------------------------------------------------------------
     Tab 焦点陷阱（inert 不可用时的兜底）
     ------------------------------------------------------------------------- */
  function trapTab(e) {
    if (e.defaultPrevented) return;   /* 输入框自己处理了 Tab 补全 */

    var focusables = modal.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), [href], select, textarea'
    );
    if (focusables.length < 2) return;

    var first = focusables[0];
    var last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* -------------------------------------------------------------------------
     全局快捷键
     ------------------------------------------------------------------------- */
  function isTypingTarget(node) {
    if (!node) return false;
    var tag = node.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || node.isContentEditable === true;
  }

  function onGlobalKey(e) {
    /* Esc 关闭 */
    if (e.key === 'Escape') {
      if (!modal.hasAttribute('hidden')) {
        e.preventDefault();
        close();
      }
      return;
    }

    /* 反引号 / 波浪号 开关终端（在输入框里就让它正常输入字符） */
    if (e.key === '`' || e.key === '~') {
      if (isTypingTarget(e.target)) return;
      e.preventDefault();
      if (modal.hasAttribute('hidden')) open(); else close();
    }
  }

  /* -------------------------------------------------------------------------
     提交
     不依赖表单的"隐式提交"：这个表单里没有提交按钮，
     各浏览器对无提交按钮时的 Enter 行为并不一致，所以显式处理，
     否则用户敲下回车什么都不发生——这是最伤人的那种 bug
     ------------------------------------------------------------------------- */
  function submit() {
    var text = input.value;
    input.value = '';
    pushHistory(text.trim());
    runCommand(text);
  }

  LY.terminal = {
    init: function () {
      modal = document.getElementById('terminal');
      out = document.getElementById('term-out');
      form = document.getElementById('term-form');
      input = document.getElementById('term-input');

      if (!modal || !out || !form || !input) return;

      /* 提交 */
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        submit();
      });

      /* 输入框内部按键 */
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          submit();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          navHistory(-1);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          navHistory(1);
        } else if (e.key === 'Tab') {
          e.preventDefault();
          complete();
        }
      });

      modal.addEventListener('keydown', trapTab);

      /* 点击遮罩空白处关闭 */
      modal.addEventListener('pointerdown', function (e) {
        if (e.target === modal) close();
      });

      var closeBtn = document.getElementById('term-close');
      if (closeBtn) closeBtn.addEventListener('click', close);

      /* 触发入口 */
      ['term-btn', 'hero-term'].forEach(function (id) {
        var btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', open);
      });

      document.addEventListener('keydown', onGlobalKey);
    },

    open: open,
    close: close,
    print: print
  };

})(window.LY = window.LY || {});
