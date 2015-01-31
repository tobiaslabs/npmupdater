var http = require('http')
var level = require('level-mem')
var EventEmitter = require('events').EventEmitter

var GetAndPushCommit = require('../lib/get-and-push-commit')
var GetRecentCommits = require('../lib/get-recent-commits')
var ModuleRequestResponder = require('../lib/module-request-responder')
var authorization = require('../lib/authorization')

var emitter = new EventEmitter()
emitter.on('log', eventLogger)
emitter.on('commit:add', commitAdded)
emitter.on('module:add', moduleAdded)

var getAndPushCommit = new GetAndPushCommit(emitter)
var getRecentCommits = new GetRecentCommits(emitter)

var level = level('mod_server', {
	keyEncoding: 'utf8',
	valueEncoding: 'json'
})

var requestResponder = new ModuleRequestResponder({
	emitter: emitter,
	database: level,
	authorization: authorization
})

http.createServer(requestResponder).listen(1337)

function eventLogger(string, json) {
	if (json) {
		console.log(string, JSON.stringify(json))
	} else {
		console.log(string)
	}
}

function commitAdded(commit) {
	getAndPushCommit(commit, function(err) {
		if (err) {
			emitter.emit('log', 'Error adding commit: ' + commit.sha, err)
		} else {
			emitter.emit('log', 'Success updating module on npm.')
		}
	})
}

function moduleAdded(module) {
	getRecentCommits(module, function(err, commits) {
			if (err) {
				emitter.emit('log', 'Error retreiving commits for module: ' + module.name, err)
			} else {
				emitter.emit('log', 'Success updating module on npm.')
			}
	})
}
