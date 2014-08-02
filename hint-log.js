/**
* HintLog creates a queue of messages logged by ngHint modules. This object
* has a key for each ngHint module that corresponds to the messages
* from that module.
*/
var queuedMessages = {},
  MESSAGE_TYPES = ['Error Messages', 'Warning Messages', 'Suggestion Messages'];

/**
* Add a message to the HintLog message queue. Messages are organized into categories
* according to their module name and severity.
**/
function logMessage(moduleName, message, severity) {
  //If no severity was provided, categorize the message under `Suggestion Messages`
  severity = severity || 3;
  var messageType = MESSAGE_TYPES[severity-1];
  //If no ModuleName was found, categorize the message under `General`
  moduleName = moduleName || 'General';

  //If the category does not exist, initialize a new object
  queuedMessages[moduleName] = queuedMessages[moduleName] || {};
  queuedMessages[moduleName][messageType] = queuedMessages[moduleName][messageType] || [];

  if(queuedMessages[moduleName][messageType].indexOf(message) < 0) {
    queuedMessages[moduleName][messageType].push(message);
  }

  module.exports.onMessage(message);
}

/**
* Return and empty the current queue of messages.
**/
function flush() {
  var flushMessages = queuedMessages;
  queuedMessages = {};
  return flushMessages;
}

module.exports.onMessage = function(message) {};
module.exports.logMessage = logMessage;
module.exports.flush = flush;
