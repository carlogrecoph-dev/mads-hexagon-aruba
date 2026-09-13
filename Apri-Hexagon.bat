@echo off
cd /d "%~dp0"
echo Hexagon si apre nel browser. Non chiudere questa finestra.
start "" "http://127.0.0.1:8765/"
python -m http.server 8765 --bind 127.0.0.1
if errorlevel 1 py -3 -m http.server 8765 --bind 127.0.0.1
pause
