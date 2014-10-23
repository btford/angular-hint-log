var hintLog = require('./hint-log');

describe('hintLog', function() {

  afterEach(function() {
    expect(hintLog.flush()).toEqual({});
  });

  describe('logMessage', function() {
    it('should add a new message to the message queue', function() {
      hintLog.logMessage('Directives', 'An error', 1);
      expect(hintLog.flush()['Directives'].error).toEqual(['An error']);
    });


    it('should queue modules without a given name under General', function() {
      hintLog.logMessage('','An error', 1);
      expect(hintLog.flush()['General'].error).toEqual(['An error']);
    });


    it('should queue modules without a given severity under Suggestion', function() {
      hintLog.logMessage('','An error');
      expect(hintLog.flush()['General'].suggestion).toEqual(['An error']);
    });


    it('should prevent the logging of duplicate messages', function() {
      //Same error, only logged once
      hintLog.logMessage('Directives', 'An error', 1);
      hintLog.logMessage('Directives', 'An error', 1);
      expect(hintLog.flush()['Directives'].error.length).toBe(1);

      //Different errors, both logged
      hintLog.logMessage('Directives', 'An error', 1);
      hintLog.logMessage('Directives', 'An error part 2', 1);
      expect(Object.keys(hintLog.flush()['Directives'].error).length).toBe(2);

      //Different severities, both logged
      hintLog.logMessage('Directives', 'An error', 1);
      hintLog.logMessage('Directives', 'An error part 2', 2);
      var log = hintLog.flush();
      expect(Object.keys(log['Directives'].error).length).toBe(1);
      expect(Object.keys(log['Directives'].warning).length).toBe(1);

      hintLog.logMessage('','An error', 1);
      hintLog.logMessage('','An error', 1);
      expect(Object.keys(hintLog.flush()['General'].error).length).toBe(1);
    });
  });

  describe('flush', function() {
    it('should return the currently queued messages', function() {
      hintLog.logMessage('', 'An error', 1);
      hintLog.logMessage('', 'Another error', 1);
      var log = hintLog.flush();
      expect(log['General'].error).toEqual(['An error', 'Another error']);
    });


    it('should empty the queued messages', function() {
      hintLog.logMessage('', 'An error', 1);
      hintLog.logMessage('', 'Another error', 2);
      var log = hintLog.flush();
      expect(log['General'].error[0]).toEqual('An error');
      expect(log['General'].warning[0]).toEqual('Another error');
      expect(hintLog.flush()).toEqual([]);
    });
  });

  describe('onMessage', function() {
    it('should be called whenever a message is added', function() {
      hintLog.onMessage = jasmine.createSpy('onMessage');
      hintLog.logMessage('', 'An error', 1);
      expect(hintLog.onMessage).toHaveBeenCalledWith('General', 'An error', 'error', undefined);
      hintLog.flush();
    });
  });
});