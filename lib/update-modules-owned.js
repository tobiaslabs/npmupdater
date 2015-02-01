var Promise = require('promise')

function updateModulesOwned(options, cb) {
	options.getUserModules(options.config.username, function(err, modules) {
		var promises = []
		if (!err) {
			modules.filter(function modulesNotYetAdded(moduleName) {
				return options.watchedModules.indexOf(moduleName) < 0
			}).forEach(function runAddModule(moduleName) {
				promises.push(new Promise(function(resolve) {
					options.getModuleDetails(moduleName, function(err, module) {
						if (err) {
							resolve(err)
						} else {
							options.routing.client().act({
								put: 'module',
								token: options.config.token,
								name: module.name,
								version: module.version,
								user: module.user,
								repo: module.repo
							}, resolve)
						}
					})
				}))
			})

			options.watchedModules.filter(function modulesNotYetDeleted(module) {
				return modules.indexOf(module) < 0
			}).forEach(function runRemoveModule(module) {
				promises.push(new Promise(function(resolve) {
					options.routing.client().act({
						remove: 'module',
						token: options.config.token,
						name: module
					}, resolve)
				}))
			})
		}
		Promise.all(promises).then(function() {
			cb()
		})
	})
}