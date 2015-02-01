var test = require('tape')
var getRecentCommit = require('../lib/get-recent-commit')

var module = {
	name: 'fp-core',
	user: 'sdmp',
	repo: 'ftp-core',
	branch: 'master',
	npmVersion: '0.0.1'
}

test('get the most recent commit from a module', function(t) {
	getRecentCommit(module, function(err, data) {
		t.equal(data.name, module.name, 'module name should match')
		t.ok(data.sha, 'there should be a sha on the object')
		t.end()
	})
})
