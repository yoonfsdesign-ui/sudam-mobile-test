$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$indexPath = Join-Path $PSScriptRoot 'index.html'
$cssPath = Join-Path $PSScriptRoot 'css\polish-v5.42.css'
$jsPath = Join-Path $PSScriptRoot 'js\polish-v5.42.js'
if (!(Test-Path $indexPath)) { throw 'index.html missing: unzip this patch in the original site root.' }
if (!(Test-Path $cssPath) -or !(Test-Path $jsPath)) { throw 'v5.42 CSS/JS missing: keep ZIP folder paths.' }
$utf8 = [System.Text.UTF8Encoding]::new($false)
$content = [System.IO.File]::ReadAllText($indexPath,[System.Text.Encoding]::UTF8)
if (!$content.Contains('polish-v5.40.css') -or !$content.Contains('polish-v5.40.js')) {
  throw 'This does not look like the v5.40/v5.41 SUDAM index.html.'
}
$backupPath = Join-Path $PSScriptRoot 'index.html.before-v5.42.bak'
if (!(Test-Path $backupPath)) { [System.IO.File]::Copy($indexPath,$backupPath) }
$content = [regex]::Replace($content,'<link\b(?=[^>]*polish-v5\.(?:41|42)\.css)[^>]*>','')
$content = [regex]::Replace($content,'<script\b(?=[^>]*polish-v5\.42\.js)[^>]*>\s*</script>','')
$content = $content.Replace('블루리본 4회 선정','블루리본 5회 선정')
$content = $content.Replace('2025·2026 연속 선정','2025·2026·2027 연속 선정')
$content = $content.Replace('2025–2027 3년 연속 선정','2025·2026·2027 연속 선정')
$content = [regex]::Replace($content,'src="\./js/polish-v5\.40\.js(?:\?[^\"]*)?"','src="./js/polish-v5.40.js?v=20261126-540-restored"')
if (!$content.Contains('20261126-540-restored')) { throw 'Original v5.40 JS reference not found.' }
$headRx = New-Object System.Text.RegularExpressions.Regex('</head>')
$content = $headRx.Replace($content,('<link rel="stylesheet" href="./css/polish-v5.42.css?v=20261126-542"/>' + "`r`n" + '</head>'),1)
$bodyRx = New-Object System.Text.RegularExpressions.Regex('</body>')
$content = $bodyRx.Replace($content,('<script src="./js/polish-v5.42.js?v=20261126-542"></script>' + "`r`n" + '</body>'),1)
if (([regex]::Matches($content,'polish-v5.42.css')).Count -ne 1 -or ([regex]::Matches($content,'polish-v5.42.js')).Count -ne 1) {
  throw 'Patch validation error; index.html was not written.'
}
[System.IO.File]::WriteAllText($indexPath,$content,$utf8)
Write-Host 'SUCCESS: v5.42 applied to index.html.' -ForegroundColor Green
Write-Host 'GitHub upload: index.html, css/polish-v5.42.css, js/polish-v5.42.js, js/polish-v5.40.js'
Write-Host 'Local backup: index.html.before-v5.42.bak'
