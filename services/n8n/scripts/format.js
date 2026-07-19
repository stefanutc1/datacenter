
const inputItem = $input.item.json;

return {
  json: {
    statusText: inputItem.status === 'UP' ? 'The service is working' : 'The service isnt working',
    serviceName: inputItem.name || 'Unknown',
    timestamp: new Date().toISOString()
  }
};
