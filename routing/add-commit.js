// TODO: when a commit is added:
//    check if module exists (fail if it does not)
//    update module version number and updated date

var auth = require('./authorization')

module.exports = function addCommit(options) {
	if (!options || !options.database || !options.routing || !options.naming) {
		throw new Error('implementation error')
	}
	options.log = options.log || function(){}

	options.routing.add({
		put: 'commit'
	}, function(commit, done) {
		if (!commit || !commit.module || !commit.module.name || !commit.module.version || !commit.sha) {

			done(true, {
				badRequest: true,
				message: 'Must specify commit properties: {module.name, module.version, sha}'
			})
		} else if (!options.naming.moduleNameIsValid(commit.module.name)) {
			done(true, {
				badRequest: true,
				message: 'Module name is invalid'
			})
		} else {
			auth(commit.token, function(isAllowed) {
				if (!isAllowed) {
					options.log('debug', 'add-commit', 'unauthorized', 'attempted to add commit: "' + commit.module.name + options.naming.separator + commit.sha + '"')
					done(true, {
						notAuthorized: true,
						message: 'Not authorized'
					})
				} else {
					var obj = {
						module: {
							name: commit.module.name,
							version: commit.module.version
						},
						sha: commit.sha
					}
					options.database.put(commit.module.name + options.naming.separator + commit.sha, obj, function(err) {
						options.log('debug', 'get-commit', 'database', 'error adding commit: "' + commit.module.name + options.naming.separator + commit.sha + '"')
						if (err) {
							done(true, {
								notFound: true,
								message: 'Error adding commit "' + commit.name + '"'
							})
						} else {
							options.log('debug', 'get-commit', 'database', 'success adding commit: "' + commit.module.name + options.naming.separator + commit.sha + '"')
							done(false, commit)
						}
					})
				}
			})
		}
	})
}


