/* ============================================================================
   data.js — 站点的"机器可读"副本
   ----------------------------------------------------------------------------
   这里的内容**只服务于终端彩蛋**（以及开机序列的日志行）。
   页面上肉眼可见的正文全部写在 index.html 里，
   所以：改文案 → 改 index.html；改终端的输出 → 改这里。
   两边不一致时，页面显示的是 index.html 的版本。
   ========================================================================= */
(function (LY) {
  'use strict';

  /* -------------------------------------------------------------------------
     开机序列日志行
     label 会被点号补齐到固定宽度，value 按状态着色
     ------------------------------------------------------------------------- */
  LY.BOOT = [
    { label: 'NYX-BIOS v3.1',        value: 'ARCADE SYSTEMS 1987-2026' },
    { label: 'MEMORY CHECK',         value: '640K OK',            ok: true },
    { label: 'PHOSPHOR DRIVER',      value: 'LOADED',             ok: true },
    { label: 'APERTURE GRILLE',      value: 'CALIBRATED',         ok: true },
    { label: 'MOUNT /dev/portfolio', value: 'OK',                 ok: true },
    { label: 'SCANNING SECTORS',     value: '7 / 7',              ok: true },
    { label: 'LOADING GUEST PROFILE', value: 'LIN YAN',           ok: true },
    { label: 'UPLINK',               value: 'ESTABLISHED',        ok: true },
    { label: 'WARN: HALLUCINATION',  value: 'WITHIN BUDGET',      warn: true },
    { label: 'READY',                value: 'WELCOME BACK' }
  ];

  /* -------------------------------------------------------------------------
     分节注册表 —— 终端里 ls / open 的依据
     ------------------------------------------------------------------------- */
  LY.SECTIONS = [
    { id: 'hero',       cmd: 'whoami', label: '首页' },
    { id: 'about',      cmd: 'about',  label: '关于我' },
    { id: 'capability', cmd: 'matrix', label: '能力矩阵' },
    { id: 'career',     cmd: 'career', label: '职业路径' },
    { id: 'work',       cmd: 'work',   label: '代表项目' },
    { id: 'method',     cmd: 'method', label: '方法论' },
    { id: 'uplink',     cmd: 'uplink', label: '联系方式' }
  ];

  /* -------------------------------------------------------------------------
     身份信息
     ------------------------------------------------------------------------- */
  LY.SITE = {
    name:   '林砚',
    handle: 'LIN YAN',
    role:   'AI 产品经理',
    roleEn: 'AI PRODUCT MANAGER',
    tag:    '把模型能力，翻译成用户价值。',
    loc:    '上海 · UTC+8',
    email:  'hi@linyan.dev',
    github: 'github.com/linyan',
    wechat: 'linyan_pm'
  };

  /* -------------------------------------------------------------------------
     能力矩阵（终端的 skills 命令读这里）
     ------------------------------------------------------------------------- */
  LY.CAPS = [
    { name: '模型理解与能力边界', v: 4, max: 5 },
    { name: 'LLM 应用设计',      v: 5, max: 5 },
    { name: '评测与质量',        v: 4, max: 5 },
    { name: '数据与指标',        v: 4, max: 5 },
    { name: '需求与优先级',      v: 5, max: 5 },
    { name: '跨团队推进',        v: 4, max: 5 }
  ];

  /* -------------------------------------------------------------------------
     代表项目
     ------------------------------------------------------------------------- */
  LY.PROJECTS = [
    {
      code: 'ATLAS', name: '企业知识库 Agent', role: '产品负责人',
      summary: '企业客户用自己的文档库提问，答案可溯源。',
      decision: '放弃纯向量检索，改结构化索引 + 混合检索，用一点召回换可追溯性。',
      results: ['答案可溯源率 68% → 95%', '客户周均检索 2.3 万次', '次年续费率 +11pt'],
      tags: ['RAG', 'AGENT', '评测体系']
    },
    {
      code: 'MUSE', name: 'C 端 AI 写作助手', role: '从 0 到 1 产品经理',
      summary: '面向内容创作者的协作式写作工具。',
      decision: '拒绝做一键成文，改做逐段协作，把控制权交回作者。',
      results: ['次日留存 14% → 31%', '上线半年 180 万 MAU'],
      tags: ['LLM 应用', '留存', '交互设计']
    },
    {
      code: 'SENTRY', name: '内容风控分级审核', role: '产品 + 数据',
      summary: '按置信度分级的人机协同审核系统。',
      decision: '不做全自动替代人工，灰区交人工并回流成训练数据。',
      results: ['人工审核量 −70%', '误杀率 −0.4pt', '漏放率持平'],
      tags: ['风控', '人机协同', '指标设计']
    },
    {
      code: 'THIS', name: '你正在看的这个网站', role: '设计 + 实现',
      summary: '零依赖、零构建的复古像素个人站。',
      decision: '全程手写 HTML / CSS / 原生 JS，所有炫技效果都能一键关闭。',
      results: ['0 个第三方 JS 依赖', '禁用 JS 后内容仍可完整阅读'],
      tags: ['HTML', 'CSS', '原生 JS']
    }
  ];

  /* -------------------------------------------------------------------------
     职业经历
     ------------------------------------------------------------------------- */
  LY.CAREER = [
    {
      when: '2023.06 — NOW', org: '某头部大模型公司', role: '高级 AI 产品经理',
      results: ['任务一次完成率 61% → 84%', '服务 400+ 企业客户', '答案可溯源率 68% → 95%']
    },
    {
      when: '2021.03 — 2023.05', org: '某头部互联网公司', role: 'AI 产品经理',
      results: ['人工转接率 −37%', '单次会话成本 −52%', '意图识别准确率 88% → 94%']
    },
    {
      when: '2019.07 — 2021.02', org: '某 SaaS 公司', role: '产品经理 · 后转 AI 方向',
      results: ['功能使用率 63%', '成为当年新签客户第一提及卖点']
    },
    {
      when: '2015.09 — 2019.06', org: '某大学', role: '信息管理 · 学士',
      results: ['毕业论文：推荐系统的冷启动问题']
    }
  ];

  /* -------------------------------------------------------------------------
     终端命令表
     每个命令实现一个 run(io)，io 提供：
       io.arg     第一个参数（已 trim）
       io.print() 输出，接受字符串 / 数组 / {t, c} 对象
       io.clear() 清屏
       io.open()  跳到某个分节并关闭终端
       io.close() 关闭终端
     想加命令：在这里加一项，help 会自动带上它。
     ------------------------------------------------------------------------- */
  LY.COMMANDS = {

    help: {
      desc: '显示这份命令列表',
      run: function (io) {
        io.print({ t: '可用命令', c: 'ok' });
        io.print({ t: '' });
        Object.keys(LY.COMMANDS).forEach(function (name) {
          var c = LY.COMMANDS[name];
          var pad = new Array(Math.max(2, 18 - name.length)).join(' ');
          io.print([
            { t: '  ' + name + pad, c: 'ok' },
            { t: c.desc, c: 'out' }
          ]);
        });
        io.print({ t: '' });
        io.print({ t: '提示：↑ ↓ 翻历史，Tab 补全，Esc 关闭。', c: 'dim' });
      }
    },

    whoami: {
      desc: '我是谁',
      run: function (io) {
        var s = LY.SITE;
        io.print([
          { t: s.name + '  ' + s.handle + '\n', c: 'ok' },
          { t: s.role + ' / ' + s.roleEn + '\n', c: 'out' },
          { t: '"' + s.tag + '"\n', c: 'dim' },
          { t: s.loc }
        ]);
      }
    },

    about: {
      desc: '一段自我介绍',
      run: function (io) {
        io.print({ t: LY.SITE.name + ' · ' + LY.SITE.role, c: 'ok' });
        io.print({ t: '' });
        io.print('做 AI 产品六年，踩过的坑比上线过的功能多。');
        io.print('最深的体会是：这一行最难的问题从来不是"模型能不能做到"，');
        io.print('而是"这件事值不值得用模型做"。');
        io.print({ t: '' });
        io.print({ t: '不信端到端，不信一键成文，不信"全自动替代人工"。', c: 'dim' });
        io.print({ t: '输入 open about 去看完整版。', c: 'dim' });
      }
    },

    skills: {
      desc: 'AI 产品能力矩阵',
      run: function (io) {
        io.print({ t: '能力矩阵（满分 5，只算真实交付过的部分）', c: 'ok' });
        io.print({ t: '' });
        LY.CAPS.forEach(function (cap) {
          var filled = new Array(cap.v + 1).join('▓');
          var empty = new Array(cap.max - cap.v + 1).join('░');
          var name = cap.name;
          var pad = new Array(Math.max(2, 24 - name.length)).join(' ');
          io.print([
            { t: '  ' + name + pad, c: 'out' },
            { t: filled, c: 'kpi' },
            { t: empty, c: 'dim' },
            { t: '  ' + cap.v + '/' + cap.max, c: 'dim' }
          ]);
        });
      }
    },

    career: {
      desc: '职业经历',
      run: function (io) {
        LY.CAREER.forEach(function (job, i) {
          if (i) io.print({ t: '' });
          io.print({ t: job.when, c: 'kpi' });
          io.print({ t: job.org + ' · ' + job.role, c: 'ok' });
          job.results.forEach(function (r) {
            io.print({ t: '  > ' + r, c: 'out' });
          });
        });
      }
    },

    projects: {
      desc: '代表项目与结果',
      run: function (io) {
        LY.PROJECTS.forEach(function (p, i) {
          if (i) io.print({ t: '' });
          io.print({ t: p.code + ' — ' + p.name, c: 'ok' });
          io.print({ t: '  角色：' + p.role, c: 'dim' });
          io.print({ t: '  决策：' + p.decision, c: 'out' });
          p.results.forEach(function (r) {
            io.print({ t: '  > ' + r, c: 'kpi' });
          });
        });
      }
    },

    work: {
      desc: 'projects 的别名',
      run: function (io) { LY.COMMANDS.projects.run(io); }
    },

    contact: {
      desc: '联系方式',
      run: function (io) {
        var s = LY.SITE;
        io.print([
          { t: 'EMAIL    ', c: 'dim' }, { t: s.email + '\n', c: 'ok' },
          { t: 'GITHUB   ', c: 'dim' }, { t: s.github + '\n', c: 'ok' },
          { t: 'WECHAT   ', c: 'dim' }, { t: s.wechat + '\n', c: 'ok' },
          { t: '\n邮件一般当天回。输入 open uplink 去看全部入口。', c: 'dim' }
        ]);
      }
    },

    uplink: {
      desc: 'contact 的别名',
      run: function (io) { LY.COMMANDS.contact.run(io); }
    },

    resume: {
      desc: '简历',
      run: function (io) {
        io.print({ t: '简历放在 assets/resume.pdf', c: 'ok' });
        io.print({ t: '（当前是占位文件，替换成你自己的 PDF 即可）', c: 'dim' });
      }
    },

    ls: {
      desc: '列出所有分节',
      run: function (io) {
        io.print({ t: 'total ' + LY.SECTIONS.length, c: 'dim' });
        LY.SECTIONS.forEach(function (s) {
          var pad = new Array(Math.max(2, 14 - s.cmd.length)).join(' ');
          io.print([
            { t: 'drwxr-xr-x  ' },
            { t: s.cmd + pad, c: 'ok' },
            { t: s.label + '   ', c: 'out' },
            { t: '# open ' + s.id, c: 'dim' }
          ]);
        });
      }
    },

    open: {
      desc: '跳到某个分节，例：open work',
      run: function (io) {
        var key = (io.arg || '').toLowerCase();
        if (!key) {
          io.print({ t: '用法：open <分节>', c: 'err' });
          io.print({ t: '可选：' + LY.SECTIONS.map(function (s) { return s.id; }).join(' / '), c: 'dim' });
          return;
        }
        var found = LY.SECTIONS.filter(function (s) {
          return s.id === key || s.cmd === key;
        })[0];

        if (!found) {
          io.print({ t: '没有这个名字的分节：' + key, c: 'err' });
          io.print({ t: '试试 ls 看全部。', c: 'dim' });
          return;
        }

        io.print({ t: '跳转到 ' + found.label + ' …', c: 'ok' });
        io.open(found.id);
      }
    },

    clear: {
      desc: '清屏',
      run: function (io) { io.clear(); }
    },

    matrix: {
      desc: '别按这个',
      run: function (io) {
        io.print({ t: 'wake up, product manager…', c: 'ok' });
        io.rain();
      }
    },

    sudo: {
      desc: '试试看',
      run: function (io) {
        io.print({ t: 'sudo: 权限不足。', c: 'err' });
        io.print({ t: '你已经有权限改这个网站了——去改 index.html。', c: 'dim' });
      }
    },

    exit: {
      desc: '关闭终端',
      run: function (io) { io.close(); }
    }
  };

  /* 别名 */
  LY.COMMANDS.quit = { desc: 'exit 的别名', run: LY.COMMANDS.exit.run };
  LY.COMMANDS.q = LY.COMMANDS.quit;
  LY.COMMANDS.goto = { desc: 'open 的别名', run: LY.COMMANDS.open.run };
  LY.COMMANDS.skills.desc = 'AI 产品能力矩阵';

})(window.LY = window.LY || {});
