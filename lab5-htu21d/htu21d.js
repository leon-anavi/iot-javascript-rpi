#! /usr/bin/env node

var i2c = require('htu21d-i2c');
var htu21d = new i2c();

htu21d.readTemperature(function (temp) {
	console.log('Temperature: '+temp+'C');

	// Retrieve humidity
	htu21d.readHumidity(function (humidity) {
		if (0 > humidity) {
			humidity = 0;
		}
		console.log('Humidity: '+humidity+'%');
	});
});
