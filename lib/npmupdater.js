var semver = require('semver')
var githubVersion = require('github-module-version')

var npmDetails = require('./npm-module-details')
var pushToNpm = require('./push-commit-to-npm')

module.exports = function npmupdater(options, cb) {
	options = options || {}
	options.githubAuth = options.githubAuth || undefined

	npmDetails(options.module, function(err, npm) {
		if (err) {
			cb({ npm: err })
		} else {
			githubVersion(npm, function(err, github) {
				if (err) {
					cb({ github: err })
				} else {
					if (semver.gt(github.properties.version, npm.version)) {
						pushToNpm({
							user: github.user,
							repo: github.repo,
							sha: github.commit.sha
						}, function(err) {
							if (err) {
								cb({ push: err })
							} else {
								cb(false, { push: true, version: github.properties.version })
							}
						})
					} else {
						cb(false, { push: false, version: npm.version })
					}
				}
			})
		}
	})
}
