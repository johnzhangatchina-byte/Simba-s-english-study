$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root
$port = 8080
$prefix = "http://localhost:$port/"
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($prefix)
try { $listener.Start() } catch { Write-Host "无法监听 $prefix ，请换一个端口或用管理员权限再试。"; exit 1 }
Write-Host "请在浏览器打开： $prefix"
Write-Host "不要直接双击 index.html，否则麦克风和离线缓存往往不可用。"
Write-Host "按 Ctrl+C 结束。"
$mime = @{
  ".html"="text/html; charset=utf-8"; ".css"="text/css; charset=utf-8"; ".js"="text/javascript; charset=utf-8";
  ".json"="application/json; charset=utf-8"; ".mp3"="audio/mpeg"; ".webmanifest"="application/manifest+json";
  ".txt"="text/plain; charset=utf-8"; ".md"="text/plain; charset=utf-8"; ".png"="image/png"; ".svg"="image/svg+xml"
}
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $path = [Uri]::UnescapeDataString($ctx.Request.Url.LocalPath.TrimStart("/"))
  if ([string]::IsNullOrWhiteSpace($path)) { $path = "index.html" }
  $full = Join-Path $root $path
  if (-not (Test-Path $full) -or (Get-Item $full).PSIsContainer) {
    $ctx.Response.StatusCode = 404
    $buf = [Text.Encoding]::UTF8.GetBytes("Not found")
    $ctx.Response.OutputStream.Write($buf, 0, $buf.Length)
    $ctx.Response.Close(); continue
  }
  $ext = [IO.Path]::GetExtension($full).ToLower()
  $ctx.Response.ContentType = $(if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" })
  $bytes = [IO.File]::ReadAllBytes($full)
  $ctx.Response.ContentLength64 = $bytes.Length
  $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  $ctx.Response.Close()
}
