// This is a simplified approach, you'd probably want something more involved

module.exports = function authorization(token, cb) {
	var allowedTokens = [
		'abc123lolbutts'
	]
	var isAllowed = allowedTokens.indexOf(token) >= 0
	cb(isAllowed)
}
