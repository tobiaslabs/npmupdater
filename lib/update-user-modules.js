var Promise = require('promise')
var semver = require('semver')

var getModuleDetails = Promise.denodeify(require('./get-module-details'))
var getNpmModules = Promise.denodeify(require('./get-npm-modules'))
var getRecentCommit = Promise.denodeify(require('./get-recent-commit'))
var pushToNpm = Promise.denodeify(require('./push-commit-to-npm'))

module.exports = Promise.nodeify(function UpdateUserModules(username) {
	return getNpmModules(username).then(function checkModuleVersions(modules) {
		var promises = modules.map(function(moduleName) {
			return getModuleDetails(moduleName).then(getRecentCommit).then(function checkCommitModuleVersion(commit) {
				if (semver.gt(commit.version, module.version)) {
					return pushToNpm(commit).then(function() {
						return { updated: new Date(), module: moduleName }
					})
				} else {
					return { checked: new Date(), module: moduleName }
				}
			}).catch(function errorUpdatingModule(err) {
				return { module: moduleName, error: err }
			})
		})
		return Promise.all(promises)
	}, function errorGettingNpmModules(err) {
		console.log(new Date(), 'error getting module list from npm', err)
		throw err
	})
})
