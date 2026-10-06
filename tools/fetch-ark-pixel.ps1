# 下载 Ark Pixel Font 的 woff2 包并列出内容，挑选需要的文件。用完可删。
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$tag  = '2026.09.25'
$name = "ark-pixel-font-12px-proportional-ttf.woff2-v$tag.zip"
$url  = "https://github.com/TakWolf/ark-pixel-font/releases/download/$tag/$name"

$tmp = Join-Path $PSScriptRoot '_tmp'
New-Item -ItemType Directory -Force -Path $tmp | Out-Null
$zip = Join-Path $tmp $name

if (-not (Test-Path $zip)) {
  Invoke-WebRequest -Uri $url -OutFile $zip -TimeoutSec 600
}

Write-Output ("zip size: {0} bytes" -f (Get-Item $zip).Length)
Write-Output '--- contents ---'

Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::OpenRead($zip)
$archive.Entries | Sort-Object Length -Descending | ForEach-Object {
  Write-Output ('  {0,10}  {1}' -f $_.Length, $_.FullName)
}
$archive.Dispose()
