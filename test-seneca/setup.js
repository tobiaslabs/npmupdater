var level = require('level-mem')
var uuid = require('uuidv4')

function database() {
	var uuidSoThatEachLevelMemDatabaseIsUnique = uuid()
	return level(uuidSoThatEachLevelMemDatabaseIsUnique, {
		keyEncoding: 'utf8',
		valueEncoding: 'json'
	})
}

var naming = {
	separator: '/',
	moduleNameIsValid: function moduleNameIsValid(string) {
		return string.indexOf('/') < 0
	}
}

module.exports = function setup(fun) {
	var seneca = require('seneca')()
	var db = database()
	var options = {
		routing: seneca,
		database: db,
		naming: naming
	}
	fun(options)
	return options
}
