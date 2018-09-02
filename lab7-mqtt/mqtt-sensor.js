#! /usr/bin/env node

var i2c = require('htu21d-i2c');
var htu21d = new i2c();

var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://localhost');

var topicPrefix = 'home/room'
var topicTemperature = topicPrefix + '/temperature';
var topicHumidity = topicPrefix + '/humidity';

htu21d.readTemperature(function (temp) {
	console.log('Temperature: '+temp+'C');
	client.publish(topicTemperature, '{ "temperature": '+temp+'}');

	// Retrieve humidity
	htu21d.readHumidity(function (humidity) {
		console.log('Humidity: '+humidity+'%');
		client.publish(topicHumidity, '{ "humidity": '+humidity+'}');
	});
});
