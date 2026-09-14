const healthService = require('../services/health.service');

const getHealth = (req, res) => {
  const healthData = healthService.getHealthStatus();
  res.status(200).json(healthData);
};

module.exports = {
  getHealth
};
