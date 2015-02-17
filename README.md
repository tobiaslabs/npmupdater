# npmupdater

![logo thingy](logo.png)

This is the core module used by the [npmupdater](http://npmupdater.com) site. To run from the
command line, use the [cli version](https://www.npmjs.org/package/npmupdater-cli).

## install

Do it the normal way way:

	npm install npmupdater

## using

This module uses the credentials of the npm user logged in on the command line.

Use it like this:

	var updater = require('npmupdater')
	updater('my-module-name', function(err, result) {
		// handle err and result
	})

The `result` is an object with the property `push` that is either `true` (if the
module was pushed to npm) or `false` (if it's not been pushed), and the property
`version`, which is the version on npm or github, whichever is greater.

## license

All documents and code of this repo are published and released under the [VOL](http://veryopenlicense.com).

<3
