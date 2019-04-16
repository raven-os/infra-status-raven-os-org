var scOverride = require('status-check');

delete scOverride['checkSingleLink'];

scOverride.checkSingleLink = function(linksArray, index, callBack, outputArray, showProgressInConsole) {
  var presentObject = this,
			http = require('http'),
			https = require('https'),
			method = https,
			alterFlag = 0,
			originalLink="";
		if(linksArray[index].indexOf('https://')===-1 && linksArray[index].indexOf('http://')===-1) {
			originalLink = linksArray[index];
			linksArray[index] = "http://" + linksArray[index];
			alterFlag = 1;
		}	
		if(linksArray[index].indexOf('https')==-1) {
			method = http;
		}
		method.get(linksArray[index], function(response) {
		 	var outputObject = {};
		 	if(!alterFlag) {
				outputObject["url"] = linksArray[index];
		 	} else {
		 		outputObject["url"] = originalLink;
		 	}
			outputObject["statusCode"] = ((typeof response != "undefined")?response.statusCode:"XXX");
			outputObject["description"] = ((typeof response != "undefined")?presentObject.getStatusDescription(response.statusCode):"Invalid URL");
			if(alterFlag) {
				outputObject["alteredLink"] = linksArray[index];
			}
			if(parseInt(outputObject["statusCode"]/100) == 3 && typeof response.headers.location != "undefined") {
				outputObject["redirectedTo"] = response.headers.location;
			}
			outputArray.push(outputObject);
			if(showProgressInConsole) {
				console.log(" Checked:: "+outputObject["url"]+" Status:: "+outputObject["statusCode"]+" Description:: "+ outputObject["description"]+((typeof outputObject["redirectedTo"])!="undefined"?" Redirected to:: "+outputObject["redirectedTo"]:""));
			}
			index+=1;
			if(index>=linksArray.length) {
				callBack(outputArray);
			} else {
				presentObject.checkSingleLink(linksArray, index, callBack, outputArray, showProgressInConsole);
			}
		}).on('error', function(error) {
      var outputObject = {};
		 	if(!alterFlag) {
				outputObject["url"] = linksArray[index];
		 	} else {
		 		outputObject["url"] = originalLink;
		 	}
			outputObject["statusCode"] = -1;
			outputObject["description"] = ((typeof response != "undefined")?presentObject.getStatusDescription(response.statusCode):"Invalid URL");
			if(alterFlag) {
				outputObject["alteredLink"] = linksArray[index];
			}
			if(parseInt(outputObject["statusCode"]/100) == 3 && typeof response.headers.location != "undefined") {
				outputObject["redirectedTo"] = response.headers.location;
			}
			outputArray.push(outputObject);
			if(showProgressInConsole) {
				console.log(" Checked:: "+outputObject["url"]+" Status:: "+outputObject["statusCode"]+" Description:: "+ outputObject["description"]+((typeof outputObject["redirectedTo"])!="undefined"?" Redirected to:: "+outputObject["redirectedTo"]:""));
			}
			index+=1;
			if(index>=linksArray.length) {
				callBack(outputArray);
			} else {
				presentObject.checkSingleLink(linksArray, index, callBack, outputArray, showProgressInConsole);
			}
    });
};

module.exports = scOverride;