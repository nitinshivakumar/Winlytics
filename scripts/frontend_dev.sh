set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR/frontend"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found. Install Node.js (includes npm) first, then re-run."
  echo "Recommended: brew install node"
  exit 1
fi

npm install
npm run dev

