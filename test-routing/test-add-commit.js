var test = require('tape')

var addCommit = require('../routing/add-commit')
var setup = require('./setup')

test('putting a commit wrongly', function(t) {
	setup(addCommit).routing.act({
		put: 'commit',
		module: {
			version: false
		}
	}, function (err, data) {
		t.ok(err, 'there should be an error')
		t.ok(data.badRequest, 'it should return a particular error')
		t.end()
	})
})

test('putting a commit correctly', function(t) {
	var options  = setup(addCommit)
	options.routing.client().act({
		put: 'commit',
		token: 'abc123lolbutts',
		module: {
			name: 'my-module',
			version: '0.0.0'
		},
		sha: 'cd92815bf6273acbaf834b9faed277c722068291'
	}, function (err, data) {
		t.notOk(err, 'there should not be an error')
		options.database.get('my-module/cd92815bf6273acbaf834b9faed277c722068291', function(err, obj) {
			t.notOk(err, 'the data should exist')
			t.equal(obj.module.name, 'my-module', 'module names should match')
			t.equal(obj.module.version, '0.0.0', 'module versions should match')
			t.equal(obj.sha, 'cd92815bf6273acbaf834b9faed277c722068291', 'commit hashes should match')
			t.end()
		})
	})
})
