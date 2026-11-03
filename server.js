import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const distPath = path.resolve(__dirname, 'dist');

// Readiness / liveness probe for Cloud Run
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve compiled static assets
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath, {
    maxAge: '1d',
    index: false // Let explicit route handle index.html to ensure SPA routing
  }));

  // Fallback for all SPA navigation routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Helpful development/fallback response if dist hasn't been built yet
  app.get('*', (req, res) => {
    res.status(503).send('Building application assets. Please run npm run build.');
  });
}

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`CivicGuild server listening on http://0.0.0.0:${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
