var push = require('../lib/push-commit-to-npm')

var commit = {
	user: 'sdmp',
	repo: 'ftp-core',
	sha: 'b5f479aeb185581c6f394b53cea145ab73afdc72'
}

push(commit, function(err, obj) {
	console.log('ERR', err)
	console.log('OBJ', obj)
})
