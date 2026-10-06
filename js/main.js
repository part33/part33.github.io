/* ============================================================================
   main.js — 初始化编排
   ----------------------------------------------------------------------------
   两条原则：
   1. 每个模块单独 try/catch —— 一个模块挂掉不该拖垮整站
   2. 顺序有讲究：先铺好静态能力（进度/矩阵/复制/终端），再演动画
   ========================================================================= */
(function (LY) {
  'use strict';

  /* -------------------------------------------------------------------------
     安全执行：模块报错时只记一笔，不阻断后续初始化
     ------------------------------------------------------------------------- */
  function safe(label, fn) {
    if (typeof fn !== 'function') return;
    try {
      fn();
    } catch (err) {
      if (window.console && console.warn) {
        console.warn('[portfolio] 模块 "' + label + '" 初始化失败：', err);
      }
    }
  }

  /* -------------------------------------------------------------------------
     最后的保险
     任何未捕获的错误都意味着"入场渲染"可能停在半路，
     这时宁可放弃动画，也不能让内容永远隐藏
     ------------------------------------------------------------------------- */
  window.addEventListener('error', function () {
    document.documentElement.classList.remove('anim-ready');
  });

  function start() {
    /* --- 第一阶段：静态能力就位 --- */
    safe('effects',  function () { LY.effects  && LY.effects.init();  });
    safe('ui',       function () { LY.ui       && LY.ui.init();       });
    safe('scroll',   function () { LY.scroll   && LY.scroll.init();   });
    safe('matrix',   function () { LY.matrix   && LY.matrix.init();   });
    safe('terminal', function () { LY.terminal && LY.terminal.init(); });
    safe('cursor',   function () { LY.cursor   && LY.cursor.init();   });

    /* --- 第二阶段：开机序列结束之后再演内容，免得演给黑屏看 --- */
    function afterBoot() {
      safe('typewriter', function () { LY.typewriter && LY.typewriter.init(); });
      safe('glitch',     function () { LY.glitch     && LY.glitch.init();     });
    }

    if (LY.boot) {
      safe('boot', function () { LY.boot.run(afterBoot); });
    } else {
      afterBoot();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }

})(window.LY = window.LY || {});
