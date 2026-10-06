# 生成一个最小可用的占位 PDF（占位简历），避免站上的"下载简历"链接 404。
# 用完可以删掉这个脚本。
$ErrorActionPreference = 'Stop'

$objs = @(
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
)

$body = "BT /F1 22 Tf 60 760 Td (PLACEHOLDER RESUME) Tj ET`n" +
        "BT /F1 11 Tf 60 728 Td (This file only exists so the download link on the site is not broken.) Tj ET`n" +
        "BT /F1 11 Tf 60 706 Td (Replace assets/resume.pdf with your real resume.) Tj ET`n"

$objs += ('<< /Length ' + $body.Length + " >>`nstream`n" + $body + 'endstream')

$sb = New-Object System.Text.StringBuilder
[void]$sb.Append("%PDF-1.4`n")

$offsets = @()
for ($i = 0; $i -lt $objs.Count; $i++) {
  $offsets += $sb.Length
  [void]$sb.Append((($i + 1).ToString() + " 0 obj`n"))
  [void]$sb.Append($objs[$i])
  [void]$sb.Append("`nendobj`n")
}

$startxref = $sb.Length
[void]$sb.Append("xref`n0 " + ($objs.Count + 1) + "`n")
[void]$sb.Append("0000000000 65535 f `n")
foreach ($o in $offsets) { [void]$sb.Append(("{0:D10} 00000 n `n" -f $o)) }
[void]$sb.Append("trailer`n<< /Size " + ($objs.Count + 1) + " /Root 1 0 R >>`nstartxref`n" + $startxref + "`n%%EOF`n")

$root = Split-Path -Parent $PSScriptRoot
$path = Join-Path $root 'assets\resume.pdf'
[System.IO.File]::WriteAllText($path, $sb.ToString(), [System.Text.Encoding]::ASCII)

Write-Output ("written: {0} ({1} bytes)" -f $path, (Get-Item $path).Length)
