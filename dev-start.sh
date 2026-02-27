#!/bin/bash
# MeTube local dev startup script
# Starts backend (Python) and frontend (Angular) with hot-reload

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🚀 Starting MeTube dev environment..."
echo "   Backend:  http://localhost:8081"
echo "   Frontend: http://localhost:4200"
echo ""
echo "Press Ctrl+C to stop both servers."
echo ""

# Start backend
cd "$PROJECT_DIR"
DOWNLOAD_DIR=/tmp/metube-dev \
STATE_DIR=/tmp/metube-dev/.metube \
PUBLIC_HOST_URL="" \
PUBLIC_HOST_AUDIO_URL="" \
uv run python app/main.py &
BACKEND_PID=$!

# Start Angular dev server (proxy API calls to backend)
cd "$PROJECT_DIR/ui"
npx ng serve --port 4200 --proxy-config ../dev-proxy.json &
FRONTEND_PID=$!

# Cleanup on exit
trap "echo 'Stopping...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT INT TERM
wait
