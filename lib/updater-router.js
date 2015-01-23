var jsonParser = require('./json-parser')
var magicUpdater

var postRoutes = [
	{
		path: '/update',
		fn: function(req, res) {
			jsonParser(req, function(err, json) {
				if (err) {
					res.statusCode = err.status
					res.end(err.message)
				} else if {
					magicUpdater(req.params, function(err) {
						if (err) {
							res.statusCode = err.status
							res.end(err.message)
						} else {
							res.statusCode = 200
							res.end('Update scheduled')
						}
					})
				}
			})
		}
	}
]

module.exports = function UpdaterRouter(updater) {
	magicUpdater = updater
	return {
		post: postRoutes
	}
}
