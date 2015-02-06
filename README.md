Gulp-Git-Watch
==============
Gulp utility to constantly check Git for updates and trigger events when detected.

	var gulp = require('gulp');
	var gitWatch = require('gulp-git-watch');

	gulp.task('git-watch', function() {
		gitWatch()
			.on('check', function() {
				console.log('CHECK!');
			})
			.on('change', function(newHash, oldHash) {
				console.log('CHANGES! FROM', oldHash, '->', newHash);
			});
	});


Options
-------

| Option              | Default                  | Description                                                                           |
|---------------------|--------------------------|---------------------------------------------------------------------------------------|
| `poll`              | 10 * 1000 - 10s          | How often gulp-git-watch should poll Git for changes                                  |
| `initialPoll`       | 10 * 1000 - 10s          | How long gulp-git-watch should wait after the initial starting point to start polling |
| `head`              | *null*                   | The initial Git HEAD value, if omitted it will be retrieved before polling            |
| `forceHead`         | false                    | Force always re-retrieving the current head state, only set this if other processes are likely to be triggering `git pull` events |
| `gitHead`           | `git rev-list HEAD -n 1` | The command to use to retrieve the current Git HEAD                                   |
| `gitPull`           | `git pull`               | The command to use to instruct Git to pull in changes


Events
------

| Event                          | Description                                                    |
|--------------------------------|----------------------------------------------------------------|
| `check()`                      | Triggered when gulp-git-watch polls Git for changes            |
| `change(newHash, oldHash)`     | Triggered when Git has updated from the old hash to a new hash |
| `nochange(hash)`               | Triggered when no Git changes were found                       |
