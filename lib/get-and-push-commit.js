var GitHubApi = require('github')

module.exports = function GetAndPushCommit(emitter) {
	var github = new GitHubApi({
		version: '3.0.0',
		debug: true,
		protocol: "https",
		// pathPrefix: "/api/v3", // for some GHEs
		timeout: 5000,
		headers: {
			'user-agent': 'npmupdater',
		}
	})

	return function getAndPush(commit, cb) {
		// http://mikedeboer.github.io/node-github/#gitdata.prototype.getCommit
		emitter.emit('log', 'Not implemented')
	}
}
