@echo off
cd /d "%~dp0"
where powershell.exe >nul 2>nul
if %errorlevel%==0 (
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0APPLY_v5.42.ps1"
  echo.
  pause
  exit /b
)
where py >nul 2>nul
if %errorlevel%==0 (py -3 APPLY_v5.42.py & pause & exit /b)
where python >nul 2>nul
if %errorlevel%==0 (python APPLY_v5.42.py & pause & exit /b)
echo Please read README_v5.42.txt for manual installation.
pause
