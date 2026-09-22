const http = require("http");
const fs = require("fs");
const path = require("path");

const HOST = "127.0.0.1";
const PORT = process.env.PORT || 3000;
const ROOT_DIR = process.cwd();
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405);
    return res.end("Method Not Allowed");
  }
  let requestPath;
  try {
    requestPath = decodeURIComponent(
      new URL(req.url, `http://${req.headers.host}`).pathname,
    );
  } catch {
    res.writeHead(400);
    return res.end("Bad Request");
  }
  const filePath = path.resolve(ROOT_DIR, `.${requestPath}`);
  if (filePath !== ROOT_DIR && !filePath.startsWith(`${ROOT_DIR}${path.sep}`)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  fs.stat(filePath, (statError, stats) => {
    const targetPath =
      !statError && stats.isDirectory()
        ? path.join(filePath, "index.html")
        : filePath;
    fs.readFile(targetPath, (error, data) => {
      if (error) {
        res.writeHead(error.code === "ENOENT" ? 404 : 500, {
          "Content-Type": "text/plain; charset=utf-8",
        });
        return res.end(
          error.code === "ENOENT" ? "Not Found" : "Internal Server Error",
        );
      }
      res.writeHead(200, {
        "Content-Type":
          MIME_TYPES[path.extname(targetPath).toLowerCase()] ||
          "application/octet-stream",
        "Content-Length": data.length,
      });
      res.end(req.method === "GET" ? data : undefined);
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Static server running at http://${HOST}:${PORT}`);
  console.log(`Serving directory: ${ROOT_DIR}`);
});
// ------------_Welcome WebSocketServer World ------------------
const { WebSocketServer } = require("ws");

// http서버: 정적 파일(html,css, js, ..)서비스
// webSocket 서버 : 실시간 서비스

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("클라이언트 연결");

  //client에서 send 한 것을 받는 위치
  ws.on("message", (data) => {
    console.log(data.toString());
  });
  ws.on("close", () => {
    console.log("클라이언트 연결 해제");
  });
});
