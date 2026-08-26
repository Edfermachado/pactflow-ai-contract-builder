const fs = require('fs');
fetch('http://localhost:3000/api/parse', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fileBase64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', // 1x1 transparent pixel
    mimeType: 'image/png',
    size: 68
  })
})
.then(res => res.text())
.then(text => console.log('RESPONSE:', text))
.catch(err => console.error('ERROR:', err));
