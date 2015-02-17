var test = require('tape')
var getModuleDetails = require('../lib/npm-module-details')

test('get the user modules', function(t) {
	getModuleDetails('npmupdater', function(err, module) {
		t.notOk(err, 'this is a real module')
		t.ok(module, 'the module exists')
		t.equal(module.name, 'npmupdater', 'the module name is correct')
		t.ok(module.version, 'the module version exists')
		t.equal(module.user, 'tobiaslabs', 'the repo user is correct')
		t.equal(module.repo, 'npmupdater', 'the repo name is correct')
		t.end()
	})
})
