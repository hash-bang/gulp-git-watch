var async = require('async-chainable');
var asyncExec = require('async-chainable-exec');
var events = require('events');
var spawn = require('child_process').spawn;
var util = require('util');

function GulpGitWatch(options) {
	var self = this;
	var settings = {
		poll: 1 * 1000,
		initialPoll: 1 * 1000,
		head: null, // Current head position (if omitted it will be retrieved)
		forceHead: false, // Whether to force re-retrival of the head in each check
	};
	if (options) // Read in options (if any)
		for (var k in options)
			settings[k] = options[k];

	var GulpGitWatchCheck = function() {
		self.emit('check');

		async()
			.use(asyncExec)
			.then(function(next) {
				if (settings.head && !settings.forceHead) return next(); // Skip head retrieval stage
					async()
						.use(asyncExec)
						.exec('head', ['git', 'rev-list', 'HEAD', '-n', '1'])
						.end(function(err) {
							if (err) return next(err);
							settings.head = this.head;
							next();
						});
			})
			.exec(['git', 'pull'])
			.exec('newHead', ['git', 'rev-list', 'HEAD', '-n', '1'])
			.end(function(err) {
				if (err) {
					throw new Error(err);
				} else {
					if (this.newHead != settings.head) {
						self.emit('change', this.newHead, settings.head);
					} else {
						self.emit('nochange', settings.head);
					}
				}
				setTimeout(GulpGitWatchCheck, settings.poll); // Requeue next poll
			});
	};

	// Setup intial poll
	setTimeout(GulpGitWatchCheck, settings.initialPoll);
};

util.inherits(GulpGitWatch, events.EventEmitter);

module.exports = function(options) {
	return new GulpGitWatch(options);
};
