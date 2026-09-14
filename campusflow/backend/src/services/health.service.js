const getHealthStatus = () => {
  return {
    status: 'ok',
    message: 'CampusFlow API is running'
  };
};

module.exports = {
  getHealthStatus
};
