var test = require('tape')
var AddRoutes = require('../add-routes')

function setup() {
	return {
		naming: {
			moduleNameIsValid: function moduleNameIsValid(string) { return string.indexOf('/') < 0 }
		},
		routing: {},
		config: { token: 'lolbutts' },
		log: console.log
	}
}

test('adding routes works', function(t) {
	var options = setup()
	options.routing.add = function(route, cb) {
		cb({
			name: 'ftp-core',
			token: 'lolbutts'
		}, function(err, obj) {
			t.notOk(err, 'there should not be an error')
			t.ok(obj, 'there should be an object')
		})
	}
	var addRoute = AddRoutes(options)
	addRoute({
		route: {},
		authenticate: false,
		required: {
			name: 'string'
		},
		response: function (obj, cb) {
			cb(obj)
		}
	})
})

