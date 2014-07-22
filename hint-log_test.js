var hintLog = require('./hint-log');

describe('hintLog', function() {

  afterEach(function() {
    expect(hintLog.flush()).toEqual([]);
  });

  describe('logMessage', function() {
    it('should add a new message to the message queue', function() {
      hintLog.logMessage('An error');
      expect(hintLog.flush()).toEqual(['An error']);
    });
  });

  describe('flush', function() {
    it('should return the currently queued messages', function() {
      hintLog.logMessage('An error');
      hintLog.logMessage('Another error');
      expect(hintLog.flush()).toEqual(['An error', 'Another error']);
    });


    it('should empty the queued messages', function() {
      hintLog.logMessage('An error');
      hintLog.logMessage('Another error');
      expect(hintLog.flush()).toEqual(['An error', 'Another error']);
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