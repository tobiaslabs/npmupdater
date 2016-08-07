# npmupdater [![Build Status](https://travis-ci.org/tobiaslabs/npmupdater.svg?branch=master)](https://travis-ci.org/tobiaslabs/npmupdater)

![logo thingy](logo.png)

This is the core module used by the [npmupdater cli](https://www.npmjs.org/package/npmupdater-cli).

## install

Do it the normal way way:

```sh
npm install npmupdater
```

## using

This module uses the credentials of the npm user logged in on the command line.

Use it like this:

```js
var updater = require('npmupdater')
updater('my-module-name', function(err, result) {
	// handle err and result
})
```

The `result` is an object with the property `push` that is either `true` (if the
module was pushed to npm) or `false` (if it's not been pushed), and the property
`version`, which is the version on npm or github, whichever is greater.

## license

[VOL](http://veryopenlicense.com)
