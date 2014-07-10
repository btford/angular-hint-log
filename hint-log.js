(function (hintLog) {
  hintLog.logMessages = function(messages, module) {
    return true;
  }

}((typeof module !== 'undefined' && module && module.exports) ?
      (module.exports = window.hintLog = {}) : (window.hintLog = {}) ));