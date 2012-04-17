var cp = require('child_process');
var zombie = require('zombie');
var assert = require('assert');
var path = require('path');
var fs = require('fs');
var tools = require('../lib/tools');

var websites = [];

function next()	{
	var website = websites.shift();
	if(!website) return;

	var server = cp.spawn('node', [website.options.server, website.options.port], {cwd: website.rootPath, customFds: [process.stdin.fd, process.stdout.fd, process.stderr.fd]});
	
	server.on('exit', function (code, signal) {
		assert.ifError(code);

		next();
	});
	
	setTimeout(function(){
		walkServer(server, website.options);
	}, website.options.startupDelay);

}



function walkServer(server, options){
	var history = [];
	var pendingVisits = 0;
	var rootUrl = 'http://localhost:' + options.port + '/';

	walkUrl(rootUrl) ;

	function beginVisit()	{
		pendingVisits++;
	}
	function endVisit()	{
		pendingVisits--;
		if(!pendingVisits) server.kill('SIGHUP');
	}

	function walkUrl(url)	{
		if(url.substring(0, rootUrl.length) != rootUrl) return;
		if(~history.indexOf(url)) return;
		history.push(url);
		beginVisit();
		zombie.visit(url, function (err, browser, status) {
			console.log(status + '\t' + url);
			assert.ifError(err);
		
			//console.log(browser);
			var links = browser.querySelectorAll('a');
			var linkCount = links.length;
			for(var linkIndex = 0; linkIndex < linkCount; linkIndex++)	{
				var link = links[linkIndex];
				walkUrl(link.href);
			}
			endVisit();
		});
	}
}

function loadDirectory(dirPath, options)	{
	var extendOptionsJson = '{}';
	try	{
		extendOptionsJson = fs.readFileSync(dirPath + '.json', 'utf-8');
	}
	catch(ex)	{
	}
	var extendOptions = JSON.parse(extendOptionsJson);
	var options = tools.extend({}, options, extendOptions);
	
	var hasServer = false;
	var serverPath = dirPath + '/' + options.server + '.js';
	var serverStat = null;

	try	{
		var serverStat = fs.statSync(serverPath);
	}
	catch(ex)	{
	}

	if(serverStat && serverStat.isFile())	{
		websites.push({
			rootPath:	dirPath
			, options:	options
		});
		return;
	}

	fs.readdirSync(dirPath).forEach(function(subPath) {
		var filePath = dirPath + '/' + subPath;
		var fileStat = fs.statSync(filePath);
		if(fileStat.isDirectory()) loadDirectory(filePath, options);
	});
}



loadDirectory(path.normalize(__dirname + '/../examples/websites'), {});

next();


