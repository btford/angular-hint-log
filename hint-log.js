(function (hintLog) {

  hintLog.throwError = false;
  hintLog.debugBreak = false;
  hintLog.propOnly = false;
  hintLog.includeLine = true;
  hintLog.setLogDefault = function(defaultToSet, status) {
    switch(defaultToSet) {
      case 'throwError' :
        hintLog.throwError = status;
        break;
      case 'debuggerBreakpoint' :
        hintLog.debugBreak = status;
        break;
      case 'propertyOnly' :
        hintLog.propOnly = status;
        break;
      case 'includeLine' :
        hintLog.includeLine = status;
        break;
      default :
        throw new Error('Tried to set unknown log default: ' + defaultToSet);
    }
  };

  //Record past messages so that the same line number will not
  //be repeatedly reported
  hintLog.pastMessages = {};
  hintLog.currentMessages = [];
  hintLog.lines = [];
  hintLog.domElements = {};
  hintLog.moduleName;
  hintLog.moduleDescription;
  hintLog.lineNumber = 1;


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
    console.groupCollapsed('Angular Hint: ' + hintLog.moduleName + ' ' + hintLog.moduleDescription);
    for(var i = 0; i < hintLog.currentMessages.length; i++) {
      if(hintLog.includeLine && hintLog.moduleName != 'Directives' || hintLog.moduleName != 'Interpolation') {
        console.warn(hintLog.currentMessages[i] + ' ' + hintLog.lines[i]);
      }
      else {
        console.groupCollapsed(hintLog.currentMessages[i]);
      }
      if(hintLog.moduleName === 'Directives' || hintLog.moduleName === 'Interpolation') {
        console.log(hintLog.domElements[hintLog.lines[i]]);
        console.groupEnd();
      }
    }
    console.groupEnd();
  };

  hintLog.logMessages = function() {
    console.log('Angular Hint: ' + hintLog.moduleName + ' ' + hintLog.moduleDescription);
    for(var i = 0; i < hintLog.currentMessages.length; i++) {
      if(hintLog.includeLine) {
        console.log(hintLog.currentMessages[i] + ' ' + hintLog.lines[i]);
      }
      else {
        console.log(hintLog.currentMessages[i]);
      }
      if(hintLog.moduleName === 'Directives' || hintLog.moduleName === 'Interpolation') {
        console.log(hintLog.domElements[hintLog.lines[i]]);
      }
    }
  }

  hintLog.foundError = function(error) {
    if(hintLog.debugBreak) {
      debugger;
    }
    else if(hintLog.throwError) {
      throw new Error(error + ' ' + hintLog.findLineNumber(hintLog.lineNumber));
    }
    else {
      if(hintLog.moduleName === 'Directives' || hintLog.moduleName === 'Interpolation') {
        if(!hintLog.propOnly) {
          hintLog.createErrorMessage(error, hintLog.findLineNumber(hintLog.lineNumber), domElement);
        }
        else {
          hintLog.createErrorMessage(error, hintLog.findLineNumber(hintLog.lineNumber));
        }
      }
      else {
        hintLog.createErrorMessage(error, hintLog.findLineNumber(hintLog.lineNumber));
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
    if(!hintLog.pastMessages[lineNumber]) {
      hintLog.pastMessages[lineNumber] = lineNumber;
      hintLog.currentMessages.push(error);
      hintLog.lines.push(lineNumber);
      if(domElement) {
        hintLog.domElements[lineNumber] = domElement;
      }
    }
  };

}((typeof module !== 'undefined' && module && module.exports) ?
      (module.exports = window.hintLog = {}) : (window.hintLog = {}) ));