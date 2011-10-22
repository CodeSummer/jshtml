Help me out by putting your templates in this folder! It's easy!
 - first you create a folder to put your tests in, youcan also create multiple folders, or even nested folders
 - then, put your jshtml templates in the folder(s)
 - if your templates are using external data, put the data in a json file. You may use one file per folder, or one file for every template. Name the json file like your folder / file, but give it a .json extension.
 - if you know what the output of the templates should be, put the expected output in a .html file, give it the same name as the template, but give it a .html extension.

you might be ending up with something like this:

	examples/
		coolorganization/
			coolwebsite.json
			coolwebsite/
				homepage.jshtml
				homepage.html
				product.jshtml
				product.html
				product.json
				contactform.jshtml
			justasimpletest.jshtml
			justasimpletest.html
			justasimpletest.json
		cooldude/
			coolblog.json
			coolblog/
				index.jshtml
				index.html
				info.jshtml
				info.html
		cooldude.json

Test the examples by running one of the tests in the test folder (like this: node test/assertExamples).

If you are going to put your templates in there, thank you very much!!! If you are not, don't worry! I still love you for checking out jshtml.

2011-10-13 "Elmer Bulthuis" <elmerbulthuis@gmail.com>






It is now also possible to put your entire website in the examples/websites folder!

you may want to change the configuration by changing the /.json file in the parent folder of your website. So if your website is in /examples/websites/company1/website1/, change the configuration in /examples/company1/website1.json.

take a look at the examples/website.json file for available configuration values.

in the walkWebsite test your website will be called like this:

node {server} {port}

{server} and {port} can be configured in the configuration file. The test will start your website and then call http://localhost:{port}/. Then it will recursively follow all links it will encounter.

let me know if you need any help!

2011-10-22 "Elmer Bulthuis" <elmerbulthuis@gmail.com>





