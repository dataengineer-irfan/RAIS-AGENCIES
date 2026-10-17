$tempDir = Join-Path $env:TEMP "chrome_snap"
$desktopOut = Join-Path $PSScriptRoot "desktop_preview.png"
$mobileOut = Join-Path $PSScriptRoot "mobile_preview.png"
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"

Write-Host "Capturing desktop screenshot..."
& $chrome --headless=new --user-data-dir=$tempDir --screenshot=$desktopOut --window-size=1440,1100 --virtual-time-budget=3000 http://localhost:3001/

Write-Host "Capturing mobile screenshot..."
& $chrome --headless=new --user-data-dir=$tempDir --screenshot=$mobileOut --window-size=390,844 --virtual-time-budget=3000 http://localhost:3001/

Write-Host "Desktop exists: $(Test-Path $desktopOut)"
Write-Host "Mobile exists: $(Test-Path $mobileOut)"
