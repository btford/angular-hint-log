describe('hintLog', function() {

  describe('setLogDefaults', function() {
    it('should set default properties to true or false', function() {
      expect(hintLog.throwError).toBe(false);
      hintLog.setLogDefault('throwError', true);
      expect(hintLog.throwError).toBe(true);

      expect(hintLog.debugBreak).toBe(false);
      hintLog.setLogDefault('debuggerBreakpoint', true);
      expect(hintLog.debugBreak).toBe(true);

      expect(hintLog.propOnly).toBe(false);
      hintLog.setLogDefault('propertyOnly', true);
      expect(hintLog.propOnly).toBe(true);

      expect(hintLog.includeLine).toBe(true);
      hintLog.setLogDefault('includeLine', false);
      expect(hintLog.includeLine).toBe(false);
    });

    it('should throw an error if the default is unknown', function() {
      hintLog.moduleName = 'Test';
      hintLog.moduleDescription = 'A module to test Angular hint logging'
      expect(function() {
        hintLog.setLogDefault('notARealDefault', true);
      }).toThrow('Tried to set unknown log default: notARealDefault');
    });
  });

  describe('printAvailableMessages', function()  {
    it('should print messages at the pace of the frequency parameter', function() {
      spyOn(hintLog, 'logFormattedMessages');
      hintLog.currentMessages = ['testMessage'];
      runs(function() {
        hintLog.printAvailableMessages(500);
      });

      waits(501);

      runs(function() {
        expect(hintLog.logFormattedMessages).toHaveBeenCalled();
      });
    });
  });

  describe('logFormattedMessages', function() {
    it('should print messages using groupCollapsed and warn', function() {
      spyOn(console, 'groupCollapsed');
      spyOn(console, 'warn');

      hintLog.moduleName = 'Test';
      hintLog.moduleDescription = 'A module to test Angular hint logging';
      hintLog.currentMessages = ['testMessage'];
      hintLog.includeLine = 1;
      hintLog.logFormattedMessages();
      expect(console.groupCollapsed).toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalled();
    });


    it('should print information and line numbers if includeLine default is true', function() {
      spyOn(console, 'groupCollapsed');
      spyOn(console, 'warn');
      hintLog.moduleName = 'Test';
      hintLog.moduleDescription = 'A module to test Angular hint logging';
      hintLog.setLogDefault('includeLine', true);
      hintLog.currentMessages = ['message1', 'message2'];
      hintLog.lines = ['line1', 'line2'];
      hintLog.logFormattedMessages();
      expect(console.groupCollapsed).toHaveBeenCalledWith('Angular Hint: Test A module to test Angular hint logging');
      expect(console.warn).toHaveBeenCalledWith('message1 line1');
      expect(console.warn).not.toHaveBeenCalledWith('message2 line1');
    });


    it('should print only message if includeLine default is false', function() {
      spyOn(console, 'groupCollapsed');
      spyOn(console, 'warn');
      hintLog.moduleName = 'Test';
      hintLog.moduleDescription = 'A module to test Angular hint logging';
      hintLog.setLogDefault('includeLine', true);
      hintLog.currentMessages = ['message1', 'message2'];
      hintLog.lines = ['line1', 'line2'];
      hintLog.logFormattedMessages();
      expect(console.groupCollapsed).toHaveBeenCalledWith('Angular Hint: Test A module to test Angular hint logging');
      expect(console.warn).toHaveBeenCalledWith('message1 line1');
      expect(console.warn).not.toHaveBeenCalledWith('message2 line1');
    });


    it('should console log an element if called by the Directives module', function() {
      spyOn(console, 'groupCollapsed');
      spyOn(console, 'log');

      hintLog.moduleName = 'Directives';
      hintLog.moduleDescription = 'A module to hint about Angular Directives';
      hintLog.currentMessages = ['Did you mean ng-click?'];
      hintLog.logFormattedMessages();
      expect(console.groupCollapsed).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('logMessages', function() {
    it('should print messages using only console.log', function() {
      spyOn(console, 'groupCollapsed');
      spyOn(console, 'warn');
      spyOn(console, 'log');

      hintLog.moduleName = 'Test';
      hintLog.moduleDescription = 'A module to hint about Angular Directives';
      hintLog.currentMessages = ['Did you mean ng-click?'];
      hintLog.logMessages();
      expect(console.groupCollapsed).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalled();
    });


    it('should print information and line numbers', function() {
      spyOn(console, 'log');
      hintLog.moduleName = 'Test';
      hintLog.moduleDescription = 'A module to test Angular hint logging';
      hintLog.currentMessages = ['message1', 'message2'];
      hintLog.lines = ['line1', 'line2'];
      hintLog.logMessages();
      expect(console.log).toHaveBeenCalledWith('message1 line1');
      expect(console.log).not.toHaveBeenCalledWith('message2 line1');
    });
  });

  describe('foundError', function() {
    it('should not create messages if the debugger default is set', function() {
      spyOn(hintLog, 'createErrorMessage');
      hintLog.setLogDefault('debuggerBreakpoint', true);
      hintLog.foundError('Some error');
      expect(hintLog.createErrorMessage).not.toHaveBeenCalled();
      hintLog.setLogDefault('debuggerBreakpoint', false);
    });


    it('should throw an error if the error default is set', function() {
      hintLog.moduleName = 'Test';
      hintLog.moduleDescription = 'A module to test Angular hint logging'
      hintLog.setLogDefault('throwError', true);
      hintLog.setLogDefault('includeLine', false);
      expect(function() {
        hintLog.foundError('Some error');
      }).toThrow();
      hintLog.setLogDefault('throwError', false);
    });
  });

  describe('findLineNumber', function() {
    it('should return a value', function() {
      expect(hintLog.findLineNumber(1)).not.toBeUndefined();
    });
  });
});