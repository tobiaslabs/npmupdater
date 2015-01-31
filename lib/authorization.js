// This is a simplified approach, you'd probably want something more involved

module.exports = function authorization(request, cb) {
	var allowedTokens = [
		'abc123lolbutts'
	]
	var authToken = request.headers['authorization']
	var isAllowed = allowedTokens.indexOf(authToken) === 0
	cb(isAllowed)
}
