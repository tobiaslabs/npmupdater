var test = require('tape')

var removeCommit = require('../routing/remove-commit')
var setup = require('./setup')

test('removing a non-existant commit', function(t) {
	setup(removeCommit).routing.client().act({
		remove: 'commit',
		token: 'abc123lolbutts',
		module: 'my-module',
		sha: 'cd92815bf6273acbaf834b9faed277c722068291'
	}, function (err) {
		t.notOk(err, 'removing a non-existant commit should not throw an error')
		t.end()
	})
})

test('removing an existing commit', function(t) {
	var options = setup(removeCommit)
	options.database.put('my-module/cd92815bf6273acbaf834b9faed277c722068291', {
		module: {
			name: 'my-module',
			version: '0.0.0'
		},
		sha: 'cd92815bf6273acbaf834b9faed277c722068291'
	}, function(err) {
		t.notOk(err, 'adding commit should not throw an error')
		options.routing.client().act({
			remove: 'commit',
			token: 'abc123lolbutts',
			module: 'my-module',
			sha: 'cd92815bf6273acbaf834b9faed277c722068291'
		}, function (err) {
			t.notOk(err, 'removing an existant module should not throw an error')
			t.end()
		})
	})
})
