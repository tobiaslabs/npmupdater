var test = require('tape')

var getModules = require('../seneca/get-modules')
var setup = require('./setup')

test('getting an empty module list', function(t) {
	setup(getModules).routing.client().act({
		get: 'modules'
	}, function (err, result) {
		t.notOk(err, 'there should not be an error')
		t.ok(Array.isArray(result), 'it should be an array')
		t.equal(0, result.length, 'it should have zero items')
		t.end()
	})
})
