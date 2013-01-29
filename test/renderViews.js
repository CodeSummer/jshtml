var path = require('path');
var fs = require('fs');
var jsHtml = require('../lib/jshtml');
var tools = require('../lib/tools');

var doTests = process.argv.slice(2);

function runDirectory(dirPath, options)	{
	var extendOptionsJson = '{}';
	try	{
		extendOptionsJson = fs.readFileSync(dirPath + '.json', 'utf-8');
	}
	catch(ex)	{
	}
	var extendOptions = JSON.parse(extendOptionsJson);
	var options = tools.extend({}, options, extendOptions);
	
	fs.readdirSync(dirPath).forEach(function(subPath) {
		var filePath = dirPath + '/' + subPath;
		var fileStat = fs.statSync(filePath);
		if(fileStat.isDirectory()) runDirectory(filePath, options);
		if(fileStat.isFile()) runFile(filePath, options);
	});
}

function runFile(filePath, options)	{
	var match = /((.*\/)?(.+))\.jshtml$/i.exec(filePath);
	if (!match) return;

	if(doTests.length && !~doTests.indexOf(match[3]))	{
		return;
	}

	console.log('[' + match[0] + ']');


	var extendOptionsJson = '{}';
	try	{
		extendOptionsJson = fs.readFileSync(match[1] + '.json', 'utf-8');
	}
	catch(ex)	{
	}
	var extendOptions = JSON.parse(extendOptionsJson);
	var options = tools.extend({}, options, extendOptions);


	function write() {}
	function end() {}

	jsHtml.renderAsync(write, end, fs.readFileSync(match[1] + '.jshtml', 'utf-8'), options);
}

runDirectory(path.normalize(__dirname + '/../examples/views'), {});


