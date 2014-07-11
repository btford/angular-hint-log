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
      hintLog.moduleDescription = 'A module to test Angular hint logging'
      hintLog.currentMessages = ['testMessage'];
      hintLog.logFormattedMessages();
      expect(console.groupCollapsed).toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalled();
    });


    it('should console log an element if called by the Directives module', function() {
      spyOn(console, 'groupCollapsed');
      spyOn(console, 'warn');
      spyOn(console, 'log');

      hintLog.moduleName = 'Directives';
      hintLog.moduleDescription = 'A module to hint about Angular Directives'
      hintLog.currentMessages = ['Did you mean ng-click?'];
      hintLog.logFormattedMessages();
      expect(console.groupCollapsed).toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('logMessages', function() {
    it('should print messages without any formatting using console.log', function() {
      spyOn(console, 'groupCollapsed');
      spyOn(console, 'warn');
      spyOn(console, 'log');

      hintLog.moduleName = 'Test';
      hintLog.moduleDescription = 'A module to hint about Angular Directives'
      hintLog.currentMessages = ['Did you mean ng-click?'];
      hintLog.logMessages();
      expect(console.groupCollapsed).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalled();
    });
  });
});