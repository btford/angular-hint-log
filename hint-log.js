(function (hintLog) {

  var stackTraceLine = 1;
  var moduleName;
  var moduleDescription;
  var throwError = false;
  var debugBreak = false;
  var propOnly = false;
  var includeLine = true;

  hintLog.setLogDefault = function(defaultToSet, status) {
    switch(defaultToSet) {
      case 'stackTraceLine' :
        stackTraceLine = status;
        break;
      case 'moduleName' :
        moduleName = status;
        break;
      case 'moduleDescription' :
        moduleDescription = status;
        break;
      case 'throwError' :
        throwError = status;
        break;
      case 'debuggerBreakpoint' :
        debugBreak = status;
        break;
      case 'propertyOnly' :
        propOnly = status;
        break;
      case 'includeLine' :
        includeLine = status;
        break;
      default :
        throw new Error('Tried to set unknown log default: ' + defaultToSet);
    }
  };

  hintLog.getDefaults = function() {
    var logDefaults = {
      'stackTraceLine': stackTraceLine,
      'moduleName': moduleName,
      'moduleDescription': moduleDescription,
      'throwError': throwError,
      'debugBreak': debugBreak,
      'propOnly': propOnly,
      'includeLine': includeLine
    }
    return logDefaults;
  };

  //Record past messages so that the same line number will not
  //be repeatedly reported
  var pastMessages = {};
  var currentMessages = [];
  var lines = [];
  var domElements = {};

  //Log messages periodically
  hintLog.printAvailableMessages = function(printFrequency) {
    setTimeout(function() {
      if(hintLog.currentMessages.length > 0) {
        //Provide formatted messages if browsers allow
        if(console.groupCollapsed && console.warn) {
          hintLog.logFormattedMessages();
        }
        //Default to console.log which is available in all browsers
        else {
          hintLog.logMessages();
        }
      }
    }, printFrequency);
  };

  hintLog.printAvailableMessages(500);

  hintLog.logFormattedMessages = function() {
    console.groupCollapsed('Angular Hint: ' + moduleName + ' ' + moduleDescription);
    for(var i = 0; i < currentMessages.length; i++) {
      if(includeLine && moduleName != 'Directives') {
        console.warn(currentMessages[i] + ' ' + lines[i]);
      }
      else {
        console.warn(currentMessages[i]);
      }
      if(moduleName === 'Directives') {
        console.log(domElements[lines[i]]);
      }
    }
    console.groupEnd();
  };

  hintLog.logMessages = function() {
    console.log('Angular Hint: ' + moduleName + ' ' + moduleDescription);
    for(var i = 0; i < currentMessages.length; i++) {
      if(includeLine) {
        console.log(currentMessages[i] + ' ' + lines[i]);
      }
      else {
        console.log(currentMessages[i]);
      }
      if(moduleName === 'Directives') {
        console.log(domElements[lines[i]]);
      }
    }
  }

  hintLog.foundError = function(error) {
    if(debugBreak) {
      debugger;
    }
    else if(throwError) {
      throw new Error(error + ' ' + hintLog.findLineNumber(stackTraceLine));
    }
    else {
      if(moduleName === 'Directives') {
        if(!propOnly) {
          hintLog.createErrorMessage(error, hintLog.findLineNumber(stackTraceLine), domElement);
        }
        else {
          hintLog.createErrorMessage(error, hintLog.findLineNumber(stackTraceLine));
        }
      }
      else {
        hintLog.createErrorMessage(error, hintLog.findLineNumber(stackTraceLine));
      }
    }
  };

  hintLog.findLineNumber = function(splitNumber) {
    var e = new Error();
    //Find the line in the user's program rather than in this service
    var lineNum = e.stack.split('\n')[splitNumber];
    lineNum = lineNum.split('<anonymous> ')[1] || lineNum;
    return lineNum;
  };

  hintLog.createErrorMessage = function(error, lineNumber, domElement) {
    if(!pastMessages[lineNumber]) {
      pastMessages[lineNumber] = lineNumber;
      currentMessages.push(error);
      lines.push(lineNumber);
      if(domElement) {
        domElements[lineNumber] = domElement;
      }
    }
    hintLog.onMessage(error);
  };

  hintLog.flush = function() {
    var flushMessages = currentMessages;
    currentMessages = [];
    lines = [];
    return flushMessages;
  };

  hintLog.onMessage = function(message) {};

}((typeof module !== 'undefined' && module && module.exports) ?
      (module.exports = window.hintLog = {}) : (window.hintLog = {}) ));