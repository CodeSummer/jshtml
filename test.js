var cp = require('child_process');
var assert = require('assert');
var fs = require('fs');
var srcDir = __dirname + '/test';

var testList = [];
function next()	{
	var test = testList.shift();
	if(!test) return;

	console.log();
	console.log(test);
	console.log();

	var proc = cp.spawn('node', [test], {cwd: srcDir, customFds: [process.stdin.fd, process.stdout.fd, process.stderr.fd]});
	
	proc.on('exit', function (code, signal) {
		//assert.ifError(code);
		
		console.log();

		next();
	});
}

fs.readdirSync(srcDir).forEach(function(file) {
	var match = /(.+)\.js$/i.exec(file);
	if (!match) return;

	testList.push(match[1]);
});


next();

