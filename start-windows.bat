@echo off
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0tools\serve.ps1"
pause
