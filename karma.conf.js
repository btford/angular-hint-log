module.exports = function(config) {
  config.set({
    frameworks: ['browserify','jasmine'],
    files: [
      '*_test.js'
    ],
    exclude: [],
    preprocessors: {
      'hint-log_test.js': ['browserify']
    },
    sauceLabs: {
      testName: 'Hint Log Unit Tests',
      startConnect: true,
      options: {
        'selenium-version': '2.37.0'
      }
    },
    browsers: ['Chrome'],
    reporters: ['dots'],
    singleRun: false,
    plugins: [
      'karma-*'
      // require('karma-sauce-launcher')
    ],
    browserify: {
      debug: true
    }
  });
};