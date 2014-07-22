describe('hintLog', function() {

  describe('setLogDefaults', function() {
    it('should set default properties to true or false', function() {
      expect(hintLog.getDefaults().throwError).toBe(false);
      hintLog.setLogDefault('throwError', true);
      expect(hintLog.getDefaults().throwError).toBe(true);

      expect(hintLog.getDefaults().debugBreak).toBe(false);
      hintLog.setLogDefault('debuggerBreakpoint', true);
      expect(hintLog.getDefaults().debugBreak).toBe(true);

      expect(hintLog.getDefaults().propOnly).toBe(false);
      hintLog.setLogDefault('propertyOnly', true);
      expect(hintLog.getDefaults().propOnly).toBe(true);

      expect(hintLog.getDefaults().includeLine).toBe(true);
      hintLog.setLogDefault('includeLine', false);
      expect(hintLog.getDefaults().includeLine).toBe(false);
    });

    it('should throw an error if the default is unknown', function() {
      hintLog.setLogDefault('moduleName', 'Test');
      hintLog.setLogDefault('moduleDescription', 'A module to test Angular hint logging');
      expect(function() {
        hintLog.setLogDefault('notARealDefault', true);
      }).toThrow('Tried to set unknown log default: notARealDefault');
    });
  });

  describe('flush', function() {
    it('should return the currently queued messages', function() {
      hintLog.createErrorMessage('An error 1', 1);
      hintLog.createErrorMessage('An error 2', 2);
      expect(hintLog.flush()).toEqual(['An error 1', 'An error 2']);
    });
  });

  describe('onMessage', function() {
    hintLog.flush();
    it('should be called whenever an error message is added', function() {
      hintLog.onMessage = jasmine.createSpy('onMessage');
      hintLog.createErrorMessage('An error 1', 1);
      expect(hintLog.onMessage).toHaveBeenCalledWith('An error 1');
    });
  });

  describe('logFormattedMessages', function() {
    it('should print messages using groupCollapsed and warn', function() {
      hintLog.flush();
      hintLog.setLogDefault('throwError', false);
      hintLog.setLogDefault('debuggerBreakpoint', false);
      spyOn(console, 'groupCollapsed');
      spyOn(console, 'warn');

      hintLog.setLogDefault('moduleName', 'Test');
      hintLog.setLogDefault('moduleDescription', 'A module to test Angular hint logging');
      hintLog.createErrorMessage('An error', 1);
      hintLog.logFormattedMessages();
      expect(console.groupCollapsed).toHaveBeenCalled();
    });


    it('should print information and line numbers if includeLine default is true', function() {
      hintLog.flush();
      spyOn(console, 'groupCollapsed');
      spyOn(console, 'warn');
      hintLog.setLogDefault('moduleName', 'Test');
      hintLog.setLogDefault('moduleDescription', 'A module to test Angular hint logging');
      hintLog.setLogDefault('includeLine', true);
      hintLog.createErrorMessage('message1', 'line1');
      hintLog.logFormattedMessages();
      expect(console.groupCollapsed).toHaveBeenCalledWith('Angular Hint: Test A module to test Angular hint logging');
      expect(console.warn).toHaveBeenCalledWith('message1 line1');
    });


    it('should print only message if includeLine default is false', function() {
      spyOn(console, 'groupCollapsed');
      spyOn(console, 'warn');
      hintLog.setLogDefault('moduleName', 'Test');
      hintLog.setLogDefault('moduleDescription', 'A module to test Angular hint logging');
      hintLog.setLogDefault('includeLine', true);
      hintLog.createErrorMessage('an error', 1);
      hintLog.logFormattedMessages();
      expect(console.groupCollapsed).toHaveBeenCalledWith('Angular Hint: Test A module to test Angular hint logging');
      expect(console.warn).toHaveBeenCalledWith('message1 line1');
      expect(console.warn).not.toHaveBeenCalledWith('message2 line1');
    });


    it('should console log an element if called by the Directives module', function() {
      spyOn(console, 'groupCollapsed');
      spyOn(console, 'warn');
      spyOn(console, 'log');

      hintLog.setLogDefault('moduleName', 'Directives');
      hintLog.setLogDefault('moduleDescription', 'A module to test Angular hint Directives');
      hintLog.currentMessages = ['Did you mean ng-click?'];
      hintLog.logFormattedMessages();
      expect(console.groupCollapsed).toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('logMessages', function() {
    it('should print messages using only console.log', function() {
      hintLog.flush();
      spyOn(console, 'groupCollapsed');
      spyOn(console, 'warn');
      spyOn(console, 'log');

      hintLog.moduleName = 'Test';
      hintLog.moduleDescription = 'A module to hint about Angular Directives'
      hintLog.createErrorMessage('A message', 1);
      hintLog.logMessages();
      expect(console.groupCollapsed).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalled();
    });


    it('should print information and line numbers', function() {
      spyOn(console, 'log');
      hintLog.setLogDefault('moduleName', 'Test');
      hintLog.setLogDefault('moduleDescription', 'A module to test Angular hint logging');
      hintLog.createErrorMessage('error 1', 'line 1')
      hintLog.logMessages();
      expect(console.log).toHaveBeenCalledWith('error 1 line 1');
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
});