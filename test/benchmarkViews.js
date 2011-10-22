var assert = require('assert');
var path = require('path');
var fs = require('fs');
var jsHtml = require('jshtml');
var util = require('../lib/util');

var templateList	=	[];
var templateIndex	=	0;
var templateCount	=	templateList.length;

var iterationCount	=	20;
var iterationIndex	=	0;

var timeOffset;
var template;


function begin()	{
	timeOffset = new Date();

	jsHtml.renderAsync(write, end, template.content, template.options);
}

function write()	{
	template.writeCount += arguments.length;
}

function end()	{
	write.apply(this, arguments);
	template.totalDuration += new Date().valueOf() - timeOffset.valueOf();
	
	next();
}

function next()	{
	var fn = begin;
	if(templateIndex == 0)	{
		templateList.sort(function(a, b) {return 1 - 2 * Math.random();});
	}
	
	template = templateList[templateIndex];
	
	templateIndex ++;
	if(templateIndex < templateCount)	{
	}
	else	{
		templateIndex = 0;

		iterationIndex ++;
		if(iterationIndex < iterationCount)	{
		}
		else	{
			iterationIndex = 0;
			stop = true;
			fn = finish;
		}
	}
	fn();
}

function finish()	{
	console.log(iterationCount + ' iterations');
	console.log('writes\tms\texample');
	templateList.sort(function(a, b) {return a.totalDuration - b.totalDuration});
	templateList.forEach(function(template)	{
		console.log(template.writeCount + '\t' + template.totalDuration + '\t' + template.name);
	});
}






function loadDirectory(dirPath, options)	{
	var extendOptionsJson = '{}';
	try	{
		extendOptionsJson = fs.readFileSync(dirPath + '.json', 'utf-8');
	}
	catch(ex)	{
	}
	var extendOptions = JSON.parse(extendOptionsJson);
	var options = util.extend({}, options, extendOptions);
	
	fs.readdirSync(dirPath).forEach(function(subPath) {
		var filePath = dirPath + '/' + subPath;
		var fileStat = fs.statSync(filePath);
		if(fileStat.isDirectory()) loadDirectory(filePath, options);
		if(fileStat.isFile()) loadFile(filePath, options);
	});
}

function loadFile(filePath, options)	{
	var match = /((.*\/)?(.+))\.jshtml$/i.exec(filePath);
	if (!match) return;


	var extendOptionsJson = '{}';
	try	{
		extendOptionsJson = fs.readFileSync(match[1] + '.json', 'utf-8');
	}
	catch(ex)	{
	}
	var extendOptions = JSON.parse(extendOptionsJson);
	var options = util.extend({}, options, extendOptions);

	
	var content = fs.readFileSync(match[1] + '.jshtml', 'utf-8');
	templateList.push({
		name: match[3]
		, content:	content
		, options:	util.extend({}, options)
		, totalDuration:	0
		, writeCount:	0
	});
	templateCount++;
}


loadDirectory(path.normalize(__dirname + '/../examples/views'), {});


next();

