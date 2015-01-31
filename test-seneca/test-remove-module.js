var test = require('tape')

var putModule = require('../seneca/remove-module')
var setup = require('./setup')

test('removing a non-existant module', function(t) {
	setup(putModule).routing.client().act({
		remove: 'module',
		name: 'fake-module'
	}, function (err) {
		t.notOk(err, 'removing a non-existant module should not throw an error')
		t.end()
	})
})

test('removing an existant module', function(t) {
	var options = setup(putModule)
	options.database.put('fake-module', {
		name: 'fake-module',
		version: '0.0.0',
		repository: {
			type: 'git',
			url: 'site.com'
		}
	}, function(err) {
		t.notOk(err, 'adding should not throw an error')
		options.routing.client().act({
			remove: 'module',
			name: 'fake-module'
		}, function (err) {
			t.notOk(err, 'removing an existant module should not throw an error')
			t.end()
		})
	})
})
