var https = require('https')
var GitHubApi = require('github')

module.exports = function getRecentCommit(module, cb) {
	var github = new GitHubApi({
		version: '3.0.0',
		protocol: 'https',
		timeout: 5000,
		headers: {
			'user-agent': 'npmupdater'
		}
	})

	if (!module || !module.name || !module.user || !module.repo || !module.version) {
		cb('Must include npm module name, user, repo, and npm semver.')
	} else {
		github.repos.getCommits({
			user: module.user,
			repo: module.repo,
			path: 'package.json',
			page: 1,
			per_page: 1
		}, function(err, data) {
			if (Array.isArray(data) && data.length === 1) {
				var sha = data[0].sha
				https.get('https://raw.githubusercontent.com/' + module.user + '/' + module.repo + '/' + sha + '/package.json', function(res){
					res.on('data', function(d) {
						try {
							var version = JSON.parse(d).version
							cb(false, {
								name: module.name,
								user: module.user,
								repo: module.repo,
								sha: sha,
								version: version
							})
						} catch (ignore) {
							cb('Error parsing JSON data of package.json')
						}
					})
				}).on('error', function(err) {
					cb('Error retrieving package.json of "' + module.user + '/' + module.repo + ':' + sha)
				})
			} else {
				cb(err || 'Returned data is an unexpected form.')
			}
		})
	}
}
