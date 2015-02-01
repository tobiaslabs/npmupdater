var auth = require('./authorization')

module.exports = function removeCommit(options) {
	if (!options || !options.database || !options.routing || !options.naming) {
		throw new Error('implementation error')
	}
	options.log = options.log || function(){}

	options.routing.add({
		remove: 'commit'
	}, function(commit, done) {
		if (!commit || !commit.module || !commit.sha || !commit.token) {
			options.log('debug', 'remove-commit', 'badRequest', 'commit details not specified')
			done(true, {
				badRequest: true,
				message: 'Must specify module name and sha: {module,sha,token}'
			})
		} else if (!options.naming.moduleNameIsValid(commit.module)) {
			options.log('debug', 'remove-commit', 'badRequest', 'module name invalid: "' + commit.module + '"')
			done(true, {
				badRequest: true,
				message: 'Module name is invalid'
			})
		} else {
			auth(commit.token, function(isAllowed) {
				if (!isAllowed) {
					options.log('debug', 'remove-commit', 'unauthorized', 'attempted to remove commit: "' + commit.module + options.naming.separator + commit.sha + '"')
					done(true, {
						notAuthorized: true,
						message: 'Not authorized'
					})
				} else {
					options.database.del(commit.module + options.naming.separator + commit.sha, function(err) {
						if (err) {
							options.log('debug', 'remove-commit', 'database', 'error removing commit: "' + commit.module + options.naming.separator + commit.sha + '"')
							done(true, {
								notFound: true,
								message: 'Error deleting commit "' + commit.module + options.naming.separator + commit.sha + '"'
							})
						} else {
							options.log('info', 'remove-commit', 'database', 'removed commit: "' + commit.module + options.naming.separator + commit.sha + '"')
							done(false)
						}
					})
				}
			})
		}
	})
}
