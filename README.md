# 个人网站 · 复古像素霓虹赛博

零依赖、零构建、纯手写 HTML / CSS / 原生 JS 的单页个人网站。
背景是一台 CRT 显像管，内容在「屏幕」里滚动，外圈是像素机柜的边框。

- **结构**：单页滚动，7 个分节 + 全局终端浮层
- **文案**：中英混排（标题/术语用英文，正文中文）
- **依赖**：无框架、无构建步骤、无第三方 JS

---

## 快速开始

### 直接打开

双击 `index.html` 即可。
所有 JS 都是经典 `<script>`（不是 ES module），所以 `file://` 协议下也能完整工作。

### 本地预览（推荐）

有些能力和协议有关，起个本地服务体验最完整：

```powershell
# 任选其一
python -m http.server 8123 --bind 127.0.0.1
npx serve .
```

然后访问 <http://127.0.0.1:8123/>

### URL 参数

| 参数 | 作用 |
| --- | --- |
| `?boot=1` | 强制重播开机序列（默认每个会话只播一次） |
| `?fx=full` | 全效模式 |
| `?fx=low` | 只保留扫描线/光栅/暗角，去掉所有运动 |
| `?fx=off` | 关闭全部 CRT 效果（只剩内容） |

---

## 文件结构

```
index.html            全部页面内容与文案 ← 改文案只改这里
README.md             本文件

css/
  tokens.css          设计令牌（颜色/字体/间距/层级）← 换主题只改这里
  fonts.css           自托管中文像素字体的 @font-face 与选型说明
  base.css            重置 / 排版基线 / 无障碍 / 打印
  crt.css             CRT 六层视觉（扫描线/光栅/刷新带/噪点/反光/暗角）+ 机柜外框
  layout.css          骨架 / 顶部状态栏 / 左侧刻度轨道 / 开机序列层
  components.css      按钮 / 面板 / 标签 / 分块条 / 折叠 / 终端 / 提示条 / 光标
  sections.css        各分节专属（含 hero 的透视网格与像素太阳）
  responsive.css      断点 380 / 640 / 768 / 900 / 1024 / 1200 / 1440

js/
  data.js             开机日志 / 分节表 / 身份信息 / 能力矩阵 / 项目 / 终端命令表
  main.js             初始化编排（每个模块单独 try/catch）
  boot.js             开机序列（可跳过）
  effects.js          效果强度、HUD 时钟、后台暂停
  glitch.js           标题故障（随机爆发，非持续）
  typewriter.js       打字机（进入视口播一次）
  cursor.js           像素准星光标 + 点击粒子
  scroll.js           滚动进度 / 刻度高亮 / 入场渲染 / 锚点
  matrix.js           能力矩阵分块条
  ui.js               提示条 + 复制到剪贴板
  terminal.js         终端命令解释器（含 Tab 补全、↑↓ 历史、焦点捕获）

assets/
  favicon.svg         像素图标
  fonts/              Ark Pixel 简中像素字体 + OFL 许可证
  resume.pdf          占位简历（换成你自己的）

tools/                一次性辅助脚本，站点运行**不需要**它们
  make-placeholder-pdf.ps1   重新生成占位 PDF
  fetch-ark-pixel.ps1        重新下载字体
  subset-font.ps1            把字体子集化以减小体积
```

---

## 替换清单（把你的内容填进去）

文案全在 `index.html` 里，搜索 `▼ 替换` 就能逐个找到。

| # | 位置 | 改什么 | 注意事项 |
| --- | --- | --- | --- |
| 1 | `<head><title>` / `meta[name=description]` / `meta[name=author]` | 姓名与简介 | 影响搜索结果与分享卡片 |
| 2 | `.hero__title` | 你的名字 | **`data-text` 必须与文字内容完全一致**，glitch 效果靠它取文本 |
| 3 | `.hero__handle` | 姓名拼音/英文名 | `aria-hidden`，仅视觉 |
| 4 | `.hero__role-cn` / `.hero__role-en` | 职位 | 中英各一 |
| 5 | `.hero__tag` | 一句话定位 | **`data-type` 必须与文字内容一致**，打字机靠它 |
| 6 | `.hero__intro` | 两三句自我介绍 | 建议 60–90 字，超过 3 行会破坏 hero 的平衡 |
| 7 | `.about__prose` | 三段自述 | 每段一个观点 + 一个具体例子 |
| 8 | `.about__panel` 里的 `<dl class="kv">` | 现在在做 / 常驻 / 在读 / 关注 / 开放 | 5 行左右最好看 |
| 9 | `.mtx` 里 6 个 `<li>` | 能力项名称、`data-value`、`data-max`、`mtx__num`、`mtx__note` | 改分值时 `▓▓▓▓░` 的字面文本、`mtx__num`、`sr-only` 三处要同步；JS 只读 `data-value`/`data-max` |
| 10 | `.tl` 里各 `<li>` | 公司、职位、时间、成果、折叠细节 | 公司名建议保留「某头部…」的写法 |
| 11 | `.cards` 里各 `<li class="card">` | 项目代号、标题、描述、角色、关键决策、结果、标签 | 「关键决策」是面试官唯一会细看的地方，别写空话 |
| 12 | `.gates` 里各 `<li>` | 方法论五步 | 这里用序号是合理的（内容本身有先后） |
| 13 | `.links` 里各 `<li>` | 联系方式 | **`data-copy` 必须与显示文字一致**，复制按钮靠它 |
| 14 | `.foot` | 版权年份 | |
| 15 | `assets/resume.pdf` | 换成你的真实简历 | 直接覆盖同名文件即可 |
| 16 | `assets/favicon.svg` | 想换图标就改 | 16×16 像素网格，`shape-rendering="crispEdges"` |

### 终端的输出也要同步改

终端读的是 `js/data.js`（不是 `index.html`），改完文案记得同步这里，否则终端说的和页面显示的不一致：

| `js/data.js` 里的 | 对应页面位置 |
| --- | --- |
| `LY.SITE` | hero 的姓名/职位/定位语 |
| `LY.CAPS` | `.mtx` 能力矩阵 |
| `LY.PROJECTS` | `.cards` 项目卡 |
| `LY.CAREER` | `.tl` 职业时间线 |
| `LY.BOOT` | 开机序列日志行 |

### 加一条终端命令

在 `js/data.js` 的 `LY.COMMANDS` 里加一项就行，`help` 会自动带上它：

```js
mystuff: {
  desc: '一行说明',
  run: function (io) {
    io.print({ t: '普通输出' });                 // 默认色
    io.print({ t: '高亮', c: 'ok' });            // 青
    io.print({ t: '警告', c: 'err' });           // 品红
    io.print({ t: '数字', c: 'kpi' });           // 琥珀
    io.print([{ t: 'a', c: 'ok' }, { t: 'b' }]); // 同一行多色
    io.print({ t: '' });                          // 空行
  }
}
```

`io` 上还有 `clear()`、`close()`、`open(分节id)`、`rain()`。
其它命令实现的共 17 个方法签名与返回值见 `terminal.js` 的 `io()` 函数（约 150 行处）。

---

## 换配色 / 换字体

全站颜色与字体都收在 `css/tokens.css` 的 `:root` 里，改这一个文件即可：

```css
--void:        #05030a;   /* 背景 */
--phosphor:    #c9ffe8;   /* 正文 */
--neon-cyan:   #00f0ff;   /* 主强调 */
--neon-magenta:#ff2e88;   /* 次强调（glitch 色差通道） */
--neon-violet: #b026ff;   /* 第三色 */
--amber:       #ffb000;   /* 指标数字 */
```

改完记得顺手核对正文对比度不低于 4.5:1。

> **注意**：`--bezel`、`--bezel-radius`、`--hud-h` 这三个变量在 `responsive.css`
> 的断点里被重新赋值，因为它们要随屏幕尺寸变化。改它们要同时看两个文件。

---

## 关于中文字体（重要）

**为什么不用 Google Fonts 上的像素中文字体？**
Google Fonts 上的 `DotGothic16` 是**日文**字形库。实测本站正文约 **18%** 的汉字
（价、值、户、砚、产…）不在其中，会静默掉进微软雅黑 —— 同一句话里两种字体，
观感很碎。这不是理论风险，是本站在开发中真实出现过的问题。

**为什么不用 npm / jsDelivr 上的中文像素字体？**
实测没有可用包（`ark-pixel-font`、`zpix-font`、`fusion-pixel-font` 均不存在）。

**所以**：自托管 Ark Pixel Font 的简中 woff2，OFL-1.1 许可，许可证见
`assets/fonts/OFL.txt`。它是**完整字集**，因此你后续随便改文案都不会缺字。

### 体积：738 KB

想压到 ~40 KB 就跑子集化脚本：

```powershell
.\tools\subset-font.ps1
```

它会提取 `index.html` + `js/*.js` 里实际用到的所有字符，只保留这些字形。

> ⚠️ **取舍**：子集化之后，如果你新增了当时不存在的汉字，该字会掉回系统字体。
> 默认**不做**子集化，图的是「改内容永远安全」。
> 如果你确定文案已定稿，再跑这个脚本。
> 脚本会先把原字体备份成 `.full.woff2`，出问题可以换回来。

### 兜底

字体加载失败时（离线 / 文件缺失 / 被拦截），`--f-cjk` 栈依次尝试
Zpix（用户本机若装过）→ 微软雅黑 / 苹方 → 系统无衬线。
此时中文不是像素风，但排版、层级、可读性**全部不受影响**。

---

## 无障碍与降级

这个站效果很多，所以降级做得很实：

| 情况 | 行为 |
| --- | --- |
| `prefers-reduced-motion: reduce` | 开机序列立即完成；glitch 停止；打字机不启用；刷新带/噪点不播；入场改成直接显示 |
| **禁用 JS** | 全部 7 个分节内容完整可见可读；仅丢失终端、彩蛋与滚动进度 |
| `?fx=off` | 关掉全部 CRT 效果，正文可读性不变差 |
| 触摸设备（`pointer: coarse`） | 不接管原生光标（有 CSS 与 JS 双重保证） |
| 标签页切到后台 | 暂停 CRT 动画，不空耗电 |
| 打印 | 丢掉所有装饰，只留内容，链接后附 URL |

其它已处理项：跳转到主内容链接、全站 `:focus-visible` 焦点环、
终端打开时给主内容加 `inert` 并用 Tab 陷阱兜底、复制按钮有 `aria-live` 反馈、
矩阵分块条对读屏隐藏（语义由旁边的 `sr-only` 文本承担）。

### 已实测通过

- 终端 13 个命令 + 别名，含未知命令报错、`↑↓` 历史、`Tab` 补全、`Esc` 关闭
- `open work` 正确跳转并关闭终端，焦点回到触发按钮
- 全站中文 **100%** 由 Ark Pixel 渲染（微软雅黑兜底次数：0）
- 控制台无报错

### 建议你自己再跑一遍

1. Tab 键走查全站，确认焦点环始终可见
2. DevTools 模拟 `prefers-reduced-motion: reduce`
3. 断点 375 / 768 / 1024 / 1440
4. 隐私窗口打开，确认开机序列会重播

---

## 部署

纯静态，把整个目录（`tools/` 可以不传）扔到任何静态托管即可：

- **GitHub Pages**：推到仓库 → Settings → Pages → 选分支和根目录
- **Netlify / Vercel**：直接拖文件夹上去，无需构建命令
- **对象存储**：上传后开启静态网站托管
- **自己的服务器**：Nginx 指向该目录

小建议：给 `assets/fonts/*.woff2` 设长缓存（一年 + immutable），
文件名带内容哈希的话可以永久缓存。

---

## 后续可做（当前刻意没做）

- **音效**：机械键击与启动哔声。默认静音是刻意的——自动播放很讨厌。要做必须由首次点击解锁。
- **后端表单**：现在用 `mailto:` + 一键复制代替。真需要收信可以接 Formspree 之类的静态表单服务。
- **博客 / 语言切换器 / 深色浅色切换**：主题本身就是深色霓虹，做浅色版等于重做一套配色。
