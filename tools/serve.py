#!/usr/bin/env python3
"""No-cache static server for browser verification.

The plain `python3 -m http.server` sends no Cache-Control, so the preview browser
heuristically caches JS/CSS and keeps serving STALE code even after you edit +
reload — which has silently masked changes during verification (a screenshot can
look "verified" while running old code). This server sends `Cache-Control: no-store`
on every response, so the browser always fetches fresh. Serves the repo root
regardless of cwd.

Usage:  python3 tools/serve.py [port]   (default 8124)
Then open http://localhost:<port>/ in the Browser pane. Bump sw.js CACHE as usual
for the real deploy — this only affects local verification.
"""
import functools, http.server, os, socketserver, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8124


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        self.send_header("Pragma", "no-cache")
        super().end_headers()

    def log_message(self, *a):
        pass


class Server(socketserver.TCPServer):
    allow_reuse_address = True


handler = functools.partial(NoCacheHandler, directory=ROOT)
with Server(("", PORT), handler) as httpd:
    print(f"no-cache server on http://localhost:{PORT}/  (serving {ROOT})")
    httpd.serve_forever()
