var request = require('request'),
	fs = require('fs');

var token = process.env.PAPERTRAIL_TOKEN;

request({
	url: 'https://papertrailapp.com/api/v1/archives.json',
	json: true,
	headers: {
		'X-Papertrail-Token': token
	}
}, function(err, res, archives) {
	if (err) throw err;
	if (res.statusCode != 200) throw new Error('HTTP ' + res.statusCode);
	
	console.log('Downloading ' + archives.length + ' files...');
	
	var cur = 0;

	next();
	next();
	next();
	next();
	next();
	next();
	next();
	next();
	next();
	next();

	function next() {
		var arc = archives[cur],
			n = cur++,
			attempts = 0;

		attempt();

		function attempt(err) {
			var dest;

			if (attempts++ == 3) {
				console.error('Failed on ' + arc.filename, err);
				process.exit(1);
			}

			if (process.argv[2] == 's3') {
				dest = request({
					method: 'PUT',
					url: 'https://' + process.argv[3] + '.s3.amazonaws.com/' + process.argv[4] + 'dt=' + arc.filename.substr(0, 10) + '/' + arc.filename,
					aws: {
						key: process.env.AWS_ACCESS_KEY_ID,
						secret: process.env.AWS_SECRET_ACCESS_KEY,
						bucket: process.argv[3]
					}
				}).on('end', ok);
			} else {
				dest = fs.createWriteStream(arc.filename).on('finish', ok);
			}


			var req = request({
				url: arc._links.download.href,
				headers: {
					'X-Papertrail-Token': token
				}
			});

			req.pipe(dest);

			req.on('error', attempt);
			dest.on('error', attempt);

		}


		function ok() {
			console.log(n + '/' + archives.length);
			if (cur < archives.length) next();
			else console.log('Done.');
		}
	}

});
