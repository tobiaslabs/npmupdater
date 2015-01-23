var http = require('http')
var moduleRouter = require('light-router')
var ModuleRouter = require('../lib/module-router')
var ModuleInterface = require('../lib/module-interface')

module.exports = function Server(options) {
	console.log(options.emitter)
	if (!options || !options.moduleDatabase || !options.authorization || !options.emitter) {
		throw new Error('must instantiate correctly')
	}

	var router = new ModuleRouter({
		moduleInterface: new ModuleInterface(options.moduleDatabase),
		router: moduleRouter,
		auth: options.authorization,
		emitter: options.emitter
	})

	return router
}
