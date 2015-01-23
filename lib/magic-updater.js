module.exports = function MagicUpdater() {

	return function(moduleCommit, cb) {
		cb({
			status: 500,
			message: 'Magic not implemented'
		})
	}
}