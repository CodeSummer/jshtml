var path = require('path');
var fs = require('fs');
var jshtml = require('../lib/jshtml');
var tools = require('../lib/tools');


describe('compileAll', directoryTest(path.normalize(__dirname + '/../examples'), {}));


function directoryTest(rootPath, rootOptions){
	if(fs.existsSync(rootPath + '.json')){
		rootOptions = tools.extend({}, rootOptions, require(rootPath + '.json'));
	}

	return function(){
		fs.readdirSync(rootPath).forEach(function(subPath) {
			var filePath = path.join(rootPath, subPath);
			var fileStat = fs.statSync(filePath);
			var fileMatch = /^(.+)\.jshtml$/.exec(filePath);

			if(fileStat.isDirectory()) {
				describe(subPath, directoryTest(filePath, rootOptions));
			}
			if(fileStat.isFile() && fileMatch) {
				it(subPath, fileTest(fileMatch, rootOptions));
			}
		});
	}
}

function fileTest(fileMatch, fileOptions){
	if(fs.existsSync(fileMatch[1] + '.json')){
		fileOptions = tools.extend({}, fileOptions, require(fileMatch[1] + '.json'));
	}

	return function(){
		jshtml.compile(fs.readFileSync(fileMatch[0], 'utf-8'), fileOptions);
	}
}