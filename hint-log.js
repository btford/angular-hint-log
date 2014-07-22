(function (hintLog) {

  var queuedMessages = [];
  hintLog.logMessage = function(message) {
    queuedMessages.push(message);
    hintLog.onMessage(message);
  };

  hintLog.flush = function() {
    var flushMessages = queuedMessages;
    queuedMessages = [];
    return flushMessages;
  };

  hintLog.onMessage = function(message) {};

}((typeof module !== 'undefined' && module && module.exports) ?
      (module.exports = window.hintLog = {}) : (window.hintLog = {}) ));
