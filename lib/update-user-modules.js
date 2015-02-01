var Promise = require('promise')
var semver = require('semver')

var getModuleDetails = require('./get-module-details')
var getNpmModules = require('./get-npm-modules')
var getRecentCommit = require('./get-recent-commit')
var pushToNpm = require('./push-commit-to-npm')

module.exports = function UpdateUserModules(username, cb) {
	getNpmModules(username, function(err, modules) {
		var promises
		if (err) {
			console.log(new Date(), 'error getting module list from npm', err)
		} else {
			promises = modules.map(function(moduleName) {
				return new Promise(function(resolve, reject) {
					getModuleDetails(moduleName, function(err, module) {
						if (err) {
							resolve({ module: moduleName, error: err })
						} else {
							getRecentCommit(module, function(err, commit) {
								if (err) {
									resolve({ module: moduleName, error: err })
								} else if (semver.gt(commit.version, module.version)) {
									pushToNpm(commit, function(err) {
										if (err) {
											resolve({ module: moduleName, error: err })
										} else {
											resolve({ updated: new Date(), module: moduleName })
										}
									})
								} else {
									resolve({ checked: new Date(), module: moduleName })
								}
							})
						}
					})
				})
			})
		}
		Promise.all(promises).then(cb)
	})
}
