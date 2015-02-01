module.exports = function AddRoutes(options) {
	function isAllowed(required, token) {
		return !required || token === options.config.token
	}
	function moduleNameIsValid(obj) {
		return (obj && obj.module && obj.module.name && options.naming.moduleNameIsValid(obj.module.name)) || !obj.module
	}

	return function addRoute(route) {
		options.routing.add(route.route, function initializeRoute(obj, done) {
			if (!isAllowed(route.authenticate, obj.token)) {
				done(true, {
					notAuthorized: true,
					message: 'token required'
				})
			} else if (!objectHasRequiredFields(obj, route.required)) {
				done(true, {
					badRequest: true,
					message: 'missing some required fields: ' + JSON.stringify(route.required)
				})
			} else if (!moduleNameIsValid(obj)) {
				done(true, {
					badRequest: true,
					message: 'invalid module name (cannot contain "/" character)'
				})
			} else {
				route.response(obj, done)
			}
		})
	}
}

function objectHasRequiredFields(obj, required) {
	return Object.keys(required).every(function(requiredKey) {
		if (obj[requiredKey]) {
			if (typeof required[requiredKey] === 'object') {
				return objectHasRequiredFields(obj[requiredKey], required[requiredKey])
			} else {
				return typeof obj[requiredKey] === required[requiredKey]
			}
		} else {
			return false
		}
	})
}

/*
		required: {
			name: 'string',
			sha: 'string'
			module: {
				name: 'string',
				version: 'string'
			}
		}
*/