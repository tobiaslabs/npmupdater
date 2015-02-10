# npmupdater

![logo thingy](logo.png)

This is the main module used by the [https://www.npmjs.org/~npmupdater](npmupdater) user.
(The logs of the public npmupdater are available on the [npmupdater website](http://npmupdater.com).)

## install

Do it the normal way way, if you want to use it in another program/module:

	npm install npmupdater

Or if you want to run it from the command line, you can install it like:

	npm install npmupdater -g

## using

If you use it programatically, you'll call it like (this uses the user credentials of the npm user setup on the command line):

	var updater = require('npmupdater')

	updater('my-user-name', function(logs) {
		console.log(logs)
	})

If you use it on the command line, once you install with the `-g` flag, you can just do:

	npmupdater my-user-name

## License

Published and released under the [VOL](http://veryopenlicense.com).

## Help me out?

I totally take pull requests, and I like it when people file issues!

<3
