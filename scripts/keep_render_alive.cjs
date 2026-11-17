const https = require('https');

const PING_URLS = [
  'https://rais-growth-backend.onrender.com/',
  'https://rais-growth-backend.onrender.com/api/v1/google/status',
  'https://rais-growth-backend.onrender.com/api/v1/google/performance'
];

function pingEndpoint(url) {
  https.get(url, (res) => {
    console.log(`[${new Date().toISOString()}] Pinged ${url} -> Status ${res.statusCode}`);
  }).on('error', (err) => {
    console.warn(`[${new Date().toISOString()}] Ping failed for ${url}: ${err.message}`);
  });
}

function pingAll() {
  PING_URLS.forEach(pingEndpoint);
}

// Initial ping
pingAll();

// Ping every 5 minutes (300,000 ms)
setInterval(pingAll, 5 * 60 * 1000);

console.log('24/7 Render Keep-Alive Heartbeat Daemon initialized. Pinging every 5 minutes...');
