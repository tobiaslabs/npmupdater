var database

module.exports = function(leveldb) {
	database = leveldb

	return {
		getModuleList: function(cb) {
			var modules = []
			var stream = database.createKeyStream()
			stream.on('data', function(key) {
				if (key.indexOf('/') < 0) {
					modules.push(key)
				}
			})
			stream.on('close', function() {
				cb(modules)
			})
		},
		getModule: function(moduleString, cb) {
			if (!moduleString) {
				cb({
					status: 400,
					message: 'Must specify module name'
				})
			} else if (moduleString.indexOf('/') >= 0) {
				cb({
					status: 400,
					message: 'Module name cannot contain forward slash'
				})
			} else {
				database.get(moduleString, function(err, module) {
					if (err) {
						cb({
							status: 500,
							message: 'Error finding module "' + moduleString + '"'
						})
					} else {
						cb(false, module)
					}
				})
			}
		},
		putModule: function(moduleObject, cb) {
			if (!moduleObject || !moduleObject.name || !moduleObject.version || !moduleObject.repository
					|| !moduleObject.repository.type || !moduleObject.repository.url) {
				cb({
					status: 400,
					message: 'Adding module failed due to missing fields'
				})
			} else if (moduleObject.name.indexOf('/') >= 0) {
				cb({
					status: 400,
					message: 'Module name cannot contain a forward slash'
				})
			} else {
				var module = {
					owned: {
						first: new Date()
					},
					module: moduleObject,
					history: []
				}
				database.put(moduleObject.name, module, function(err) {
					if (err) {
						cb({
							status: 500,
							message: 'Error adding module "' + moduleObject.name + '"'
						})
					} else {
						cb(false, module)
					}
				})
			}
		},
		deleteModule: function(moduleString, cb) {
			if (!moduleString) {
				cb({
					status: 400,
					message: 'Must specify module name'
				})
			} else if (moduleString.indexOf('/') >= 0) {
				cb({
					status: 400,
					message: 'Module name cannot contain forward slash'
				})
			} else {
				database.del(moduleString, function(err) {
					if (err) {
						cb({
							status: 500,
							message: 'Error deleting module "' + moduleString + '"'
						})
					} else {
						cb(false)
					}
				})
			}
		},
		getModuleCommit: function(moduleCommitObject, cb) {
			// return the commit object
		},
		putModuleCommit: function(moduleCommitObject, cb) {
			// returns the final object and the status code
		},
		deleteModuleCommit: function(moduleCommitObject, cb) {
			// returns status code
		}
	}
}
