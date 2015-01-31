var getRecentCommit = require('../lib/get-recent-commit')

var module = {
	user: 'sdmp',
	repo: 'ftp-core',
	branch: 'master',
	npmVersion: '0.0.1'
}

getRecentCommit(module, function(err, data) {
	console.log('ERR', err)
	console.log('DATA', data)
})