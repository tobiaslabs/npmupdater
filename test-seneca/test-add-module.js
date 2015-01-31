var test = require('tape')

var addModule = require('../seneca/add-module')
var setup = require('./setup')

test('putting a module wrongly', function(t) {
	setup(addModule).routing.client().act({
		put: 'module',
		name: 'word/word'
	}, function (err, data) {
		t.ok(err, 'there should be an error')
		t.ok(data.badRequest, 'it should return a particular error')
		t.end()
	})
})

test('adding a module correctly', function(t) {
	var options = setup(addModule)
	options.routing.client().act({
		put: 'module',
		name: 'my-mod',
		version: '0.0.0',
		repository: {
			type: 'git',
			url: 'site.com'
		}
	}, function (err, data) {
		t.notOk(err, 'there should not be an error')
		options.database.get('my-mod', function(err, obj) {
			t.notOk(err, 'the data should exist')
			t.ok(obj, 'there should be data')
			t.end()
		})
	})
})
