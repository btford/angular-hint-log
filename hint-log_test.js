var hintLog = require('./hint-log');

describe('hintLog', function() {

  afterEach(function() {
    expect(hintLog.flush()).toEqual({});
  });

  describe('logMessage', function() {
    it('should add a new message to the message queue', function() {
      hintLog.logMessage('##Directives## An error');
      expect(hintLog.flush()['Directives']['An error']).toEqual('An error');
    });
  });


    it('should strip leading white space when using ##identifiers##', function() {
       hintLog.logMessage('##Dom## An error');
       expect(hintLog.flush()['Dom']['An error']).toEqual('An error');
       hintLog.logMessage('##General## Another error');
       hintLog.logMessage('Message without identifiers');
       expect(Object.keys(hintLog.flush()['General'])).toEqual(['Another error',
        'Message without identifiers']);
    });


    it('should queue modules without a given name under General', function() {
      hintLog.logMessage('An error');
      expect(hintLog.flush()['General']['An error']).toEqual('An error');
    });

  });

  describe('flush', function() {
    it('should return the currently queued messages', function() {
      hintLog.logMessage('An error');
      hintLog.logMessage('Another error');
      var log = hintLog.flush();
      expect(log['General']['An error']).toEqual('An error');
      expect(log['General']['Another error']).toEqual('Another error');
    });


    it('should empty the queued messages', function() {
      hintLog.logMessage('An error');
      hintLog.logMessage('Another error');
      var log = hintLog.flush();
      expect(log['General']['An error']).toEqual('An error');
      expect(log['General']['Another error']).toEqual('Another error');
      expect(hintLog.flush()).toEqual([]);
    });
  });

  describe('onMessage', function() {
    it('should be called whenever a message is added', function() {
      hintLog.onMessage = jasmine.createSpy('onMessage');
      hintLog.logMessage('An error');
      expect(hintLog.onMessage).toHaveBeenCalledWith('An error');
      hintLog.flush();
    });
  });
});