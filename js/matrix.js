/* ============================================================================
   matrix.js — 能力矩阵的像素分块条
   ----------------------------------------------------------------------------
   HTML 里写字面的 ▓▓▓▓░ 作为无 JS 兜底；
   这里把它换成真正的方块，滚动到可见时逐块点亮。
   ========================================================================= */
(function (LY) {
  'use strict';

  var BLOCK_DELAY = 90;

  function build() {
    var boxes = document.querySelectorAll('.mtx__bars[data-value]');
    var items = [];

    Array.prototype.forEach.call(boxes, function (box) {
      var value = parseInt(box.getAttribute('data-value'), 10);
      var max = parseInt(box.getAttribute('data-max'), 10) || 5;
      if (isNaN(value)) return;
      if (value < 0) value = 0;
      if (value > max) value = max;

      /* 方块是纯视觉，语义由旁边的 .sr-only 文本承担 */
      box.setAttribute('aria-hidden', 'true');

      var html = '';
      for (var i = 0; i < max; i++) html += '<i class="bar"></i>';
      box.innerHTML = html;

      items.push({
        box: box,
        value: value,
        bars: box.querySelectorAll('.bar'),
        filled: false
      });
    });

    return items;
  }

  function fill(item) {
    if (item.filled) return;
    item.filled = true;

    for (var i = 0; i < item.value; i++) {
      (function (i) {
        var delay = LY.reduced ? 0 : i * BLOCK_DELAY;
        window.setTimeout(function () {
          if (item.bars[i]) item.bars[i].classList.add('bar--on');
        }, delay);
      })(i);
    }
  }

  LY.matrix = {
    init: function () {
      var items = build();
      if (!items.length) return;

      if (!('IntersectionObserver' in window)) {
        items.forEach(fill);
        return;
      }

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          items.forEach(function (item) {
            if (item.box === entry.target) fill(item);
          });
        });
      }, { threshold: 0.35 });

      items.forEach(function (item) { io.observe(item.box); });
    }
  };

})(window.LY = window.LY || {});
