#!/bin/bash
cd "$(dirname "$0")"
PORT=8765
echo "Hexagon si apre nel browser. Non chiudere questa finestra."
if command -v python3 >/dev/null 2>&1; then PY=python3; else PY=python; fi
"$PY" -m http.server "$PORT" --bind 127.0.0.1 &
PID=$!
sleep 0.5
open "http://127.0.0.1:$PORT/"
wait $PID
