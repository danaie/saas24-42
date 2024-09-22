const fs = require('fs');
const https = require('https');
const next = require('next');

const app = next();
const handle = app.getRequestHandler();

const options = {
    key: fs.readFileSync('./ssl_certificate/privatekey.pem'),
    cert: fs.readFileSync('./ssl_certificate/certificate.pem'),
  };

app.prepare().then(() => {
    https.createServer(options, (req, res) => {
        handle(req, res);
      }).listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on https://localhost:3000');
    });
});
      
  
