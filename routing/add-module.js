// TODO: when a module is added
//    if module exists set updated date
//    else set added date
//    kick off event to grab latest commit

var auth = require('./authorization')

module.exports = function addModule(options) {
	if (!options || !options.database || !options.routing || !options.naming) {
		throw new Error('implementation error')
	}
	options.log = options.log || function(){}

	options.routing.add({
		put: 'module'
	}, function(module, done) {
		if (!module || !module.token || !module.name || !module.version || !module.user || !module.repo) {
			options.log('debug', 'add-module', 'badRequest', 'module information not specified')
			done(true, {
				badRequest: true,
				message: 'Must specify module properties: {token,name,version,user,repo}'
			})
		} else if (!options.naming.moduleNameIsValid(module.name)) {
			options.log('debug', 'add-module', 'badRequest', 'module name not valid: "' + module.name + '"')
			done(true, {
				badRequest: true,
				message: 'Module name is not valid'
			})
		} else {
			auth(module.token, function(isAllowed) {
				if (!isAllowed) {
					options.log('debug', 'add-module', 'unauthorized', 'attempted to add module: "' + module.name + '"')
					done(true, {
						notAuthorized: true,
						message: 'Not authorized'
					})
				} else {
					var obj = {
						owned: {
							first: new Date()
						},
						module: {
							name: module.name,
							version: module.version,
							user: module.user,
							repo: module.repo
						},
						history: []
					}
					options.database.put(module.name, obj, function(err) {
						if (err) {
							options.log('debug', 'add-module', 'database', 'error adding module: "' + module.name + '"')
							done(true, {
								notFound: true,
								message: 'Error adding module "' + module.name + '"'
							})
						} else {
							options.log('debug', 'add-module', 'database', 'success adding module: "' + module.name + '"')
							done(false, obj)
						}
					})
				}
			})
		}
	})
}
