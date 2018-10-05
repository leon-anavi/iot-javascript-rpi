#! /usr/bin/env node

var i2c = require('htu21d-i2c');
var htu21d = new i2c();

htu21d.readTemperature(function (temp) {
	console.log('Temperature: '+temp+'C');

	// Retrieve humidity
	htu21d.readHumidity(function (humidity) {
		console.log('Humidity: '+humidity+'%');
	});
});
