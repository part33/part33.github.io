# 把中文像素字体子集化，738 KB → 约 40 KB。
#
# 原理：扫描 index.html 与 js/*.js 里实际出现的所有字符，
#       只保留这些字形，扔掉字集里其余几万个用不到的字。
#
# ⚠️ 取舍：子集化之后，若你新增了当时不存在的汉字，该字会掉回系统字体。
#         所以默认不做。文案定稿后再跑。
#
# 用法：powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\subset-font.ps1

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$root    = Split-Path -Parent $PSScriptRoot
$fontDir = Join-Path $root 'assets\fonts'
$target  = Join-Path $fontDir 'ark-pixel-zh-hans.woff2'
$backup  = Join-Path $fontDir 'ark-pixel-zh-hans.full.woff2'
$chars   = Join-Path $PSScriptRoot '_tmp\chars.txt'

New-Item -ItemType Directory -Force -Path (Split-Path $chars) | Out-Null

if (-not (Test-Path $target)) { throw "找不到字体：$target" }

# ---- 1. 收集字符 ----
$sources = @((Join-Path $root 'index.html'))
$sources += (Get-ChildItem (Join-Path $root 'js') -Filter '*.js' | ForEach-Object { $_.FullName })

$set = New-Object 'System.Collections.Generic.HashSet[char]'

# 常用 ASCII：数字、字母、标点，以及终端界面可能用到的符号。
# 这些一定要保留，否则用户改名/改命令时会出现豆腐块。
$ascii = ' !"#$%&''()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~'
foreach ($c in $ascii.ToCharArray()) { [void]$set.Add($c) }

# 界面符号：进度条方块、箭头、光标块、终端提示符等
$symbols = '▓░█▌▐■□▪▫●○◉◆◇▲▼◄►←↑→↓─│┌┐└┘├┤┬┴┼·…—–×÷≈≠≤≥°′″€£¥§¶†‡'
foreach ($c in $symbols.ToCharArray()) { [void]$set.Add($c) }

# 从源文件里抓所有字符
foreach ($file in $sources) {
  if (-not (Test-Path $file)) { continue }
  $text = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)
  foreach ($c in $text.ToCharArray()) {
    if ([int]$c -ge 32) { [void]$set.Add($c) }
  }
}

$out = -join ($set | Sort-Object)
[System.IO.File]::WriteAllText($chars, $out, (New-Object System.Text.UTF8Encoding($false)))

Write-Output ("收集到 {0} 个唯一字符" -f $set.Count)

# ---- 2. 备份 ----
if (-not (Test-Path $backup)) {
  Copy-Item $target $backup
  Write-Output ("已备份原始字体 → {0}" -f (Split-Path $backup -Leaf))
}

# ---- 3. 子集化 ----
$subset = Join-Path $PSScriptRoot '_tmp\ark-subset.woff2'

python -m fontTools.subset $target `
  "--text-file=$chars" `
  '--flavor=woff2' `
  '--layout-features=' `
  '--no-hinting' `
  "--output-file=$subset"

if (-not (Test-Path $subset)) { throw '子集化失败，原始字体未改动。' }

$before = (Get-Item $target).Length
$after  = (Get-Item $subset).Length

if ($after -ge $before) {
  Write-Output ("子集反而更大（{0} → {1}），保持原文件不变。" -f $before, $after)
  Remove-Item $subset -Force
  exit 0
}

Copy-Item $subset $target -Force

Write-Output ''
Write-Output ("完成：{0:N0} 字节 → {1:N0} 字节（省 {2:P0}）" -f $before, $after, (1 - $after / $before))
Write-Output ''
Write-Output "原始完整字体保留在 assets\fonts\ark-pixel-zh-hans.full.woff2"
Write-Output "若新增文案后出现缺字，把它改名回 ark-pixel-zh-hans.woff2 即可还原。"
