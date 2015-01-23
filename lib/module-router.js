var jsonParser = require('./json-parser')
var moduleInterface

var getRoutes = [
	{
		path: '/module',
		fn: function(req, res) {
			moduleInterface.getModuleList(function(modules) {
				res.end(JSON.stringify(modules))
			})
		}
	},{
		path: '/module/:module',
		fn: function(req, res) {
			moduleInterface.getModule(req.params.module, createResponse(req, res))
		}
	},{
		path: '/module/:module/:sha',
		fn: function(req, res) {
			moduleInterface.getModuleCommit({
				name: req.params.module,
				sha: req.params.sha
			}, createResponse(req, res))
		}
	}
]

var putRoutes = [
	{
		path: '/module/:module',
		fn: function(req, res) {
			jsonParser(req, function(err, module) {
				if (err) {
					res.statusCode = err.status
					res.end(err.message)
				} else {
					moduleInterface.putModule(module, createResponse(req, res))
				}
			})
		}
	},{
		path: '/module/:module/:sha',
		fn: function(req, res) {
			jsonParser(req, function(err, commit) {
				if (err) {
					res.statusCode = err.status
					res.end(err.message)
				} else {
					moduleInterface.putModuleCommit(commit, createResponse(req, res))
				}
			})
		}
	}
]

var deleteRoutes: [
	{
		path: '/module/:module',
		fn: function(req, res) {
			moduleInterface.deleteModule(req.params.module, createResponse(req, res))
		}
	},{
		path: '/module/:module',
		fn: function(req, res) {
			moduleInterface.deleteModule({
				name: req.params.module,
				sha: req.params.sha
			}, createResponse(req, res))
		}
	}
]

function createResponse(req, res) {
	return function(err, obj) {
		if (err) {
			res.statusCode = err.status
			res.end(err.message)
		} else {
			res.setHeader('Content-Type', 'application/json')
			res.end(JSON.stringify(obj))
		}
	}
}

module.exports = function ModuleRouter(mod) {
	moduleInterface = mod
	return {
		get: getRoutes,
		put: putRoutes,
		del: deleteModule
	}
}
