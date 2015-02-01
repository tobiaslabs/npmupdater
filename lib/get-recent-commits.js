var Promise = require('promise')
var getRecentCommit = require('./get-recent-commit')

module.exports = function getRecentCommits(options) {
	if (!options || !options.routing) {
		throw new Error('implementation error')
	}
	options.log = options.log || function(){}

	return function getCommitsForModules(moduleNames, cb) {
		var promises = []
		moduleNames.forEach(function(moduleName) {
			var promise = new Promise(function (resolve, reject) {
				options.routing.client().act({
					get: 'module',
					name: moduleName
				}, function(err, moduleObject) {
					if (err) {
						options.log('Error getting module "' + moduleName + '"', err)
						resolve(false)
					} else {
						getRecentCommit(moduleObject.module, function(err, commit) {
							if (err) {
								options.log('Error contacting Github for commit for module "' + moduleName + '"', err)
								resolve(false)
							} else {
								resolve(commit)
							}
						})
					}
				})
			})
			promises.push(promise)
		})
		Promise.all(promises).then(function(data) {
			cb(false, data)
		})
	}
}
