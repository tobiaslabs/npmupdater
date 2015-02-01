// TODO: when successfully removing module
//    get stream of commits for module
//    use seneca to delete them

var auth = require('./authorization')

module.exports = function removeModule(options) {
	if (!options || !options.database || !options.routing || !options.naming) {
		throw new Error('implementation error')
	}
	options.log = options.log || function(){}

	options.routing.add({
		remove: 'module'
	}, function(module, done) {
		if (!module || !module.name || !module.token) {
			options.log('debug', 'remove-module', 'badRequest', 'module name not specified')
			done(true, {
				badRequest: true,
				message: 'Must specify module name: {name:"my-module"}'
			})
		} else if (!options.naming.moduleNameIsValid(module.name)) {
			options.log('debug', 'remove-module', 'badRequest', 'module name not valid: "' + module.name + '"')
			done(true, {
				badRequest: true,
				message: 'Module name is invalid'
			})
		} else {
			auth(module.token, function(isAllowed) {
				if (!isAllowed) {
					options.log('debug', 'remove-module', 'unauthorized', 'attempted to remove module: "' + module.name + '"')
					done(true, {
						notAuthorized: true,
						message: 'Not authorized'
					})
				} else {
					options.database.del(module.name, function(err) {
						if (err) {
							options.log('debug', 'remove-module', 'database', 'error deleting module: "' + module.name + '"')
							done(true, {
								notFound: true,
								message: 'Error deleting module "' + module.name + '"'
							})
						} else {
							options.log('info', 'remove-module', 'database', 'module deleted from database: "' + module.name + '"')
							done(false)
						}
					})
				}
			})
		}
	})
}
