/**
* HintLog creates a queue of messages logged by ngHint modules. This object
* has a key for each ngHint module that corresponds to the messages
* from that module.
*/
var queuedMessages = {};

/**
* Add a message to the HintLog message queue. Messages are organized into categories
* according to their module name which is included in the message with ##ModuleName##.
* If a ##ModuleName## is not included, the message is added to a `General` category
* in the queue.
**/
function logMessage(moduleName, message, severity) {

  var typeRay = ['Error Messages', 'Warning Messages', 'Suggestion Messages'];
  var typeError = typeRay[severity-1];
  //If no ModuleName was found, categorize the message under `General`
  if(moduleName === '') {
    //If the category does not exist, initialize a new object
    queuedMessages.General = queuedMessages.General || {};
    queuedMessages.General[typeError] = queuedMessages.General[typeError] || [];

    //check if message exists in array
    if(queuedMessages.General[typeError].indexOf(message) < 0) {
      queuedMessages.General[typeError].push(message);
    }
  } else {
    //If the category does not exist, initialize a new object
    queuedMessages[moduleName] = queuedMessages[moduleName] || {};
    queuedMessages[moduleName][typeError] = queuedMessages[moduleName][typeError] || [];

    if(queuedMessages[moduleName][typeError].indexOf(message) < 0) {
      queuedMessages[moduleName][typeError].push(message);
    }
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
