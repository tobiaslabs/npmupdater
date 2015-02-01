var test = require('tape')
var getRecentCommit = require('../lib/get-recent-commit')

var module = {
	name: 'fp-core',
	user: 'sdmp',
	repo: 'ftp-core',
	version: '0.0.1'
}

test('get the most recent commit from a module', function(t) {
	getRecentCommit(module, function(err, data) {
		t.notOk(err, 'error should not exist')
		t.ok(data.name, 'module name should exist')
		t.ok(data.user, 'github user should exist')
		t.ok(data.repo, 'repo name should exist')
		t.ok(data.version, 'version number should exist')
		t.ok(data.sha, 'there should be a sha on the object')
		t.end()
	})
})
