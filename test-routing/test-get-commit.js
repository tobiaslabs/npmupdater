var test = require('tape')

var getCommit = require('../routing/get-commit')
var setup = require('./setup')

test('getting a commit wrongly', function(t) {
	setup(getCommit).routing.act({
		get: 'commit'
	}, function (err, data) {
		t.ok(err, 'there should be an error')
		t.ok(data.badRequest, 'it should return a particular error')
		t.end()
	})
})

test('getting a commit for a module that does not exist', function(t) {
	setup(getCommit).routing.act({
		get: 'commit',
		name: 'my-module',
		sha: 'cd92815bf6273acbaf834b9faed277c722068291'
	}, function (err, data) {
		t.ok(err, 'there should be an error')
		t.ok(data.notFound, 'it should return a particular error')
		t.end()
	})
})

test('getting a commit that does exist', function(t) {
	var options = setup(getCommit)
	options.database.put('my-module/cd92815bf6273acbaf834b9faed277c722068291', {
		module: {
			name: 'my-module',
			version: '0.0.0'
		},
		sha: 'cd92815bf6273acbaf834b9faed277c722068291'
	}, function(err) {
		t.notOk(err, 'it should add the commit to the database')
		options.routing.client().act({
			get: 'commit',
			name: 'my-module',
			sha: 'cd92815bf6273acbaf834b9faed277c722068291'
		}, function (err, commit) {
			t.notOk(err, 'there should not be an error')
			t.equal(commit.module.name, 'my-module', 'returned module name should be correct')
			t.equal(commit.module.version, '0.0.0', 'returned module version should be correct')
			t.equal(commit.sha, 'cd92815bf6273acbaf834b9faed277c722068291', 'returned sha should be correct')
			t.end()
		})
	})
})
