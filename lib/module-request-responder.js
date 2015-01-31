var url = require('url')
var Routes = require('routes')

var ModuleInterface = require('./module-interface')
var ModuleRouter = require('./module-router')

module.exports = function ModuleRequestResponder(options) {
	if (!options || !options.emitter || !options.database || !options.authorization) {
		throw new Error('Implementation error')
	}

	options.emitter.on('module:delete', deleteModule)

	var routes = {}
	var moduleRoutes = new ModuleRouter(new ModuleInterface(options.database, options.emitter))
	moduleRoutes.forEach(function(route) {
		if (!routes[route.method]) {
			routes[route.method] = new Routes()
		}
		options.emitter.emit('log', 'Adding route: ' + route.method + ' ' + route.path)
		routes[route.method].addRoute(route.path, route.fn)
	})

	return function requestResponder(req, res) {
		var router = routes[req.method]
		if (router) {
			options.authorization(req, function(isAllowed) {
				if (isAllowed) {
					var path = url.parse(req.url).pathname
					var match = router.match(path)
					if (match) {
						options.emitter.emit('log', 'Processing:', { method: req.method,
							route: match.route,
							path: path
						})
						match.fn(req, res, match)
					} else {
						respond(res, 400, 'Method not allowed')
					}
				} else {
					respond(res, 401, 'Unauthorized. Use HTTP header "Authorization" with your token.')
				}
			})
		} else {
			respond(res, 400, 'Method not allowed')
		}
	}
}


function respond(res, status, message) {
	res.statusCode = status
	res.end(message)
}

function deleteModule(moduleString) {
	// delete all instances of the module in the database
}
