const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3001;
const rootDir = path.resolve(__dirname);

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.glb': 'model/gltf-binary',
  '.svg': 'image/svg+xml',
};

http.createServer((req, res) => {
  let filePath = path.join(rootDir, req.url === '/' ? '/index.html' : req.url);
  
  // Xavfsizlik: yuqoriga o'tib ketmaslik uchun
  if (!filePath.startsWith(rootDir)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  // Papka bo'lsa, index.html qaytarish
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(content);
  });
}).listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
