@echo off
setlocal
set "APP_DIR=%~dp0insight-dashboard-main"
set "URL=http://127.0.0.1:5173/login"

if exist "%APP_DIR%\package.json" goto app_found
echo Dashboard app folder was not found.
echo Expected: "%APP_DIR%"
pause
exit /b 1

:app_found
where node >nul 2>nul
if not errorlevel 1 goto node_found
echo Node.js is required to open this dashboard.
echo Install Node.js, then run this launcher again.
pause
exit /b 1

:node_found
cd /d "%APP_DIR%"

if exist "node_modules" goto deps_ready
echo First launch setup: installing dashboard files. This can take a few minutes.
call npm.cmd install --cache ".npm-cache"
if not errorlevel 1 goto deps_ready
echo Setup failed. Check your internet connection and run this again.
pause
exit /b 1

:deps_ready
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:5173/login' -TimeoutSec 2; if ($r.StatusCode -ge 200) { exit 0 } else { exit 1 } } catch { exit 1 }"
if not errorlevel 1 goto open_dashboard

echo Starting dashboard server...
start "Dashboard Server" /min cmd /k "cd /d ""%APP_DIR%"" && npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort"

echo Waiting for dashboard to be ready...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ready = $false; for ($i = 0; $i -lt 60; $i++) { try { $r = Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:5173/login' -TimeoutSec 2; if ($r.StatusCode -ge 200) { $ready = $true; break } } catch {}; Start-Sleep -Milliseconds 750 }; if ($ready) { exit 0 } else { exit 1 }"
if not errorlevel 1 goto open_dashboard

echo Dashboard did not start in time.
echo Leave the Dashboard Server window open and run this launcher again.
pause
exit /b 1

:open_dashboard
start "" "%URL%"
exit /b 0
