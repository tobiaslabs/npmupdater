#!/usr/bin/env node

var Emitter = require('events').EventEmitter
var Updater = require('./update-user-modules')

var emitter = new Emitter()
var update = new Updater(emitter)

// TODO: change this to take in a config.json or something
// then in the config.json put the github oauth token thing
var username = process.argv[2]

// maybe get username from whoami and then use like:
// npmupdater
//    - updates all modules
// npmupdater MODULE
//    - update specific module

emitter.on('modules:error', function(err) {
	console.log('Error getting module list for ' + username, err)
})

emitter.on('modules:success', function(modules) {
	console.log('Retrieved modules for user: ' + username)
})

emitter.on('module:name', function(module) {
	console.log('Beginning update for module: ' + module)
})

emitter.on('details:error', function(details) {
	console.log('Error getting npm details for module: ' + details.module, details.err)
})

emitter.on('details:success', function(details) {
	console.log('Retrieved module details from npm for module: ' + details.module)
})

emitter.on('github:error', function(details) {
	console.log('Error retrieving github data for module: ' + details.module, details.err)
})

emitter.on('github:success', function(details) {
	console.log('Retrieved module details from github for module: ' + details.module)
})

emitter.on('module:update', function(data) {
	console.log('Pushing module to npm: ', data.npm.name)
})

emitter.on('module:checked', function(data) {
	console.log('No update needed for module : ', data.npm.name)
})

emitter.on('update:error', function(error) {
	console.log('Error pushing module to npm:', error)
})

emitter.on('update:success', function(details) {
	console.log('Success pushing version ' + details.github.properties.version + ' of ' + details.npm.name + ' to npm')
})

console.log('Starting the updater for "' + username + '"')

update(username)
