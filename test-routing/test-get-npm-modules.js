var test = require('tape')

var getNpmModules = require('../routing/get-npm-modules')
var setup = require('./setup')

test('get the user modules', function(t) {
	setup(getNpmModules).routing.client().act({
		get: 'npm-modules',
		username: 'npmupdater'
	}, function(err, modules) {
		t.notOk(err, 'this is a real user')
		t.ok(modules && modules.length > 0, 'there are more than one modules')
		t.end()
	})
})
