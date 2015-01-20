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
							status: 404,
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
					message: 'Adding module failed due to missing fields: { name, version, repository: { type, url } }'
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
						// TODO: probably should to delete all the commits as well
						cb(false)
					}
				})
			}
		},
		getModuleCommit: function(moduleCommitObject, cb) {
			if (!moduleCommitObject || !moduleCommitObject.module || !moduleCommitObject.sha) {
				cb({
					status: 400,
					message: 'Must use required fields: { module, sha }'
				})
			} else if (moduleCommitObject.module.indexOf('/') >= 0) {
				cb({
					status: 400,
					message: 'Module name cannot contain forward slash'
				})
			} else {
				database.get(moduleCommitObject.module + '/' + moduleCommitObject.sha, function(err, commit) {
					if (err) {
						cb({
							status: 404,
							message: 'Error finding commit "' + moduleCommitObject.module + '/' + moduleCommitObject.sha + '"'
						})
					} else {
						cb(false, commit)
					}
				})
			}
		},
		putModuleCommit: function(moduleCommitObject, cb) {
			var allFilesAreStrings = false
			if (moduleCommitObject && moduleCommitObject.files && moduleCommitObject.files.length > 0) {
				allFilesAreStrings = moduleCommitObject.files.every(function(file) {
					return typeof file === 'string' && file.length > 0
				})
			}
			if (!moduleCommitObject || !moduleCommitObject.name || !moduleCommitObject.sha || !moduleCommitObject.version || !allFilesAreStrings) {
				cb({
					status: 400,
					message: 'Adding module failed due to bad fields: { name, sha, version, files: [ strings (at least one required) ] }'
				})
			} else if (moduleCommitObject.name.indexOf('/') >= 0) {
				cb({
					status: 400,
					message: 'Module name cannot contain a forward slash'
				})
			} else {
				moduleCommitObject.added = new Date()
				database.put(moduleCommitObject.module + '/' + moduleCommitObject.sha, moduleCommitObject, function(err) {
					if (err) {
						cb({
							status: 500,
							message: 'Error adding commit "' + moduleCommitObject.module + '/' + moduleCommitObject.sha + '"'
						})
					} else {
						cb(false, moduleCommitObject)
					}
				})
			}
		},
		deleteModuleCommit: function(moduleCommitObject, cb) {
			// returns status code
		}
	}
}
