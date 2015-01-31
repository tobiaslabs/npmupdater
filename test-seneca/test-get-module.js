var test = require('tape')

var getModule = require('../seneca/get-module')
var setup = require('./setup')

test('getting a module wrongly', function(t) {
	setup(getModule).routing.client().act({
		get: 'module'
	}, function (err, data) {
		t.ok(err, 'there should be an error')
		t.ok(data.badRequest, 'it should return a particular error')
		t.end()
	})
})

test('getting a module that does not exist', function(t) {
	setup(getModule).routing.client().act({
		get: 'module',
		name: 'does-not-exist'
	}, function (err, data) {
		t.ok(err, 'there should be an error')
		t.ok(data.notFound, 'it should return a particular error')
		t.end()
	})
})

test('getting a module that exists', function(t) {
	var options = setup(getModule)
	options.database.put('my-module', {
		name: 'my-module'
	}, function(err) {
		t.notOk(err, 'it should add the module to the database')
		options.routing.client().act({
			get: 'module',
			name: 'my-module'
		}, function (err, module) {
			t.notOk(err, 'there should not be an error')
			t.equal(module.name, 'my-module', 'returned data should be correct')
			t.end()
		})
	})
})
