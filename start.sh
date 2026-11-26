#!/bin/sh
cd "$(dirname "$0")"
PORT="${PORT:-8080}"
echo "请在浏览器打开： http://localhost:$PORT"
echo "不要直接双击 index.html，否则麦克风和离线缓存往往不可用。"
if command -v python3 >/dev/null 2>&1; then
  exec python3 -m http.server "$PORT"
fi
if command -v python >/dev/null 2>&1; then
  exec python -m http.server "$PORT"
fi
echo "没有找到 Python。请安装 Python 3，或把整个文件夹上传到静态网站。"
exit 1
