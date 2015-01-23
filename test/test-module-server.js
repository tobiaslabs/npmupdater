var http = require('http')
var level = require('level-mem')

var Routes = require('routes')
var router = new Routes()

var ModuleInterface = require('../lib/module-interface')
var MagicUpdater = require('../lib/magic-updater')
var ModuleRouter = require('../lib/module-router')
var UpdateRouter = require('../lib/update-router')

var level = level('mod_server', {
	keyEncoding: 'utf8',
	valueEncoding: 'json'
})

var moduleInterface = new ModuleInterface(level)
var magicUpdater = new MagicUpdater(undefined)

var moduleRouter = new ModuleRouter(moduleInterface)
var updateRouter = new UpdateRouter(magicUpdater)

var allowedTokens = [
	'abc123lolbutts'
]

function authorizeRequest(request, cb) {
	var authToken = request.headers['authorization']
	cb(allowedTokens.indexOf(authToken) < 0)
}

http.createServer(function (req, res) {
	var path = url.parse(req.url).pathname;
	var match = router.match(path);
	match.fn(req, res, match);
}).listen(1337)