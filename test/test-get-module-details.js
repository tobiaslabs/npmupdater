var test = require('tape')
var getModuleDetails = require('../lib/get-module-details.js')

test('get the user modules', function(t) {
	getModuleDetails('ftp-core', function(err, module) {
		t.notOk(err, 'this is a real module')
		t.ok(module, 'the module exists')
		t.end()
	})
})
