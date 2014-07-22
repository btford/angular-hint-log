var queuedMessages = [];
function logMessage(message) {
  queuedMessages.push(message);
  module.exports.onMessage(message);
};

function flush() {
  var flushMessages = queuedMessages;
  queuedMessages = [];
  return flushMessages;
};

module.exports.onMessage = function(message) {};
module.exports.logMessage = logMessage;
module.exports.flush = flush;