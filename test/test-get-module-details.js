var test = require('tape')
var getModuleDetails = require('../lib/get-module-details')

test('get the user modules', function(t) {
	getModuleDetails('ftp-core', function(err, module) {
		t.notOk(err, 'this is a real module')
		t.ok(module, 'the module exists')
		t.ok(module.name, 'the module name exists')
		t.ok(module.version, 'the module version exists')
		t.ok(module.user, 'the repo user exists')
		t.ok(module.repo, 'the repo exists')
		t.end()
	})
})
