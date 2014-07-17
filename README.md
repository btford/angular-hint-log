Angular Hint Log
==================

A library to format messages for the AngularHint tool

# How to Install AngularHintLog into your own AngularHint module

Working in your module's directory on the commandline, copy the following code:

```javascript
npm install angular/angular-hint-log browserify gulp vinyl-source-stream
```

This uses npm to install the `angular-hint-log` directory from GitHub as well as two dependencies
for building the library.

Next create a gulpfile to give instructions to gulp to build your module:
```javascript
touch gulpfile.js
```

Open the gulpfile.js and enter the following:
```javascript

var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');

var main = require('./package.json').main;

gulp.task('watch', function(){
  gulp.watch(['./**/*.js', '!./dist/*.js'], ['browserify']);
});

gulp.task('browserify', function() {
  var bundleStream = browserify('./' + main).bundle().pipe(source(main));
  return bundleStream.pipe(gulp.dest('./dist'));
});

gulp.task('default', ['browserify']);

```

Now that the dependencies are in place, you can add the functionality of hintLog to
your module by calling:

```javascript
var hintLog = require('angular-hint-log');

Since your module is now built by gulp using browserify, make sure to build your file for
use and testing. When testing with karma, install the following with npm:

```javascript
npm install karma-bro
```

And add the following to the appropriate places in your `karma.conf.js`:

```javascript
  frameworks: ['browserify', 'jasmine'],
  preprocessors: {
      'your-module-file.js': ['browserify']
  }
```
At this point you are set up to use the HintLog methods!

First, configure the HintLog defaults.

```javascript
  hintLog.moduleName = 'Your Angular Hint Module Name';

  hintLog.moduleDescription = 'An optional helpful message explaining the overall purpose of your module';
  /**
  * Optionally set defaults throwError, debugBreak, propOnly, includeLine to change the format of how your warning is delivered using hintLog.setLogDefault(defaultToSet, status). By default HintLog prints warnings to the developer console.
  */
  hintLog.setLogDefault('includeLine', false);
  /**
    Setting hintLog.lineNumber is necessary if you wish your module to log the line number of line where your error was triggered. The specific line number is found by splitting a stacktrace of errors. Hence, it is necessary to find the line in the stacktrace where the user's error is present. This will vary by module and must be investigated by the developer. Set hintLog.lineNumber to the line you wish to display.
  **/
  hintLog.lineNumber = 6;
```

You may choose to use different HintLog defaults depending on the type of message delivered by your module. For example AngularHintDOM includes line numbers in its warnings about function calls that manipulate the DOM from controllers, but AngularHintDirectives does not include line numbers.

Your next decision is whether to use the higher level `hintLog.foundError(error)` function or the lower level `hintLog.createErrorMessage(error, lineNumber, domElement)` function. If you do not want to allow the option of configuring the hintLog defaults, you can bypass the `hintLog.foundError` function. The `hintLog.foundError` method takes the message you wish to display to the user, finds a lineNumber to represent that error, and decides whether this should throw an error, pause the debugger, or be logged to the console based on the hintLog defaults. If your goal is only to log a message in the AngularHint format, it may be simplest to use `hintLog.createErrorMessage`. This method takes an error message to display and a line number. This line number is used to ensure that duplicate errors are not thrown. You must include a fake 'line number' even if you do not wish to log a line number.

After using either of these methods, your logging is complete!

## [License](LICENSE)

Copyright 2014 Google, Inc. http://angularjs.org

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
