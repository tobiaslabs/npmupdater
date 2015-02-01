var npm = require('npm')

module.exports = function pushCommitToNpm(commit, cb) {
	if (!commit || !commit.user || !commit.repo || !commit.sha) {
		cb('Must have the object properties {user,repo,sha}')
	} else {
		npm.load({}, function(err) {
			if (err) {
				cb('error on npm load', err)
			} else {
				npm.commands.publish([
					'https://github.com/' + commit.user + '/' + commit.repo + '/archive/' + commit.sha + '.tar.gz'
				], cb)
			}
		})
	}
}
