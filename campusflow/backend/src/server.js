const app = require('./app');
const config = require('./config');

const server = app.listen(config.port, () => {
  console.log(`=============================================`);
  console.log(`🚀 CampusFlow Backend API is running!`);
  console.log(`📡 URL: http://localhost:${config.port}`);
  console.log(`🩺 Health Check: http://localhost:${config.port}/api/health`);
  console.log(`🔧 Environment: ${config.nodeEnv}`);
  console.log(`=============================================`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
