var test = require('tape')

var GetRecentCommits = require('../lib/get-recent-commits')
var getModules = require('../routing/get-modules')
var getModule = require('../routing/get-module')

var modules = {
	'ftp-core': {
		name: 'fp-core',
		user: 'sdmp',
		repo: 'ftp-core',
		branch: 'master',
		npmVersion: '0.0.1'
	},
	'not-real': {
		name: 'not-real',
		user: 'sdmp',
		repo: 'not-real',
		branch: 'master',
		npmVersion: '0.0.9'
	}
}

test('making things do stuff', function(t) {
	var getRecentCommits = new GetRecentCommits({
		route: function(obj, cb) {
			cb(false, modules[obj.name])
		},
		log: function(x,y,z) {
			console.log(x,y,z)
		}
	})
	getRecentCommits([ 'ftp-core', 'not-real', 'does-not-exist' ], function(err, commits) {
		t.notOk(err, 'even though 2 do not exist, 1 does')
		t.end()
	})
})
