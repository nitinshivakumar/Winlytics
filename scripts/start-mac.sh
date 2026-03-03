set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! command -v osascript >/dev/null 2>&1; then
  echo "osascript not found (required to auto-open Terminal windows)."
  echo "Run manually instead:"
  echo "  bash scripts/backend_dev.sh"
  echo "  bash scripts/frontend_dev.sh"
  exit 1
fi

osascript <<APPLESCRIPT
tell application "Terminal"
  activate
  do script "cd \"$ROOT_DIR\" && bash scripts/backend_dev.sh"
  delay 1
  do script "cd \"$ROOT_DIR\" && bash scripts/frontend_dev.sh"
end tell
APPLESCRIPT

