#! /usr/bin/env node

var i2c = require('htu21d-i2c');
var htu21d = new i2c();

var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://localhost');

var topicPrefix = 'home/room'
var topicTemperature = topicPrefix + '/temperature';
var topicHumidity = topicPrefix + '/humidity';
var topicLight = topicPrefix + '/light';

var timeout = 5000;

var gpio = require('onoff').Gpio;
var red = new gpio(13, 'out');
var yellow = new gpio(19, 'out');
var green = new gpio(26, 'out');

client.on('connect', function () {
	client.subscribe(topicLight, function (err) {
		if (err) {
			console.log("Unable to subscribe.");
		}
	});
});

client.on('message', function (topic, message) {
	try {
		console.log("MQTT message received: "+message.toString());
		var data = JSON.parse(message.toString());
		if (true === data.r) {
			red.writeSync(1);
		}
		else {
			red.writeSync(0);
		}
		if (true === data.y) {
			yellow.writeSync(1);
		}
		else {
			yellow.writeSync(0);
		}
		if (true === data.g) {
			green.writeSync(1);
		}
		else {
			green.writeSync(0);
		}
	} catch (e) {
		console.log("Malformed data");
	}
});

function stop() {
	red.writeSync(0);
	yellow.writeSync(0);
	green.writeSync(0);
}

function gentleExit() {
	stop();
	client.end();
	process.exit();
}

// Handle ctrl+c and exit gently
process.on('SIGINT', gentleExit);

setInterval(function() {
	htu21d.readTemperature(function (temp) {
		console.log('Temperature: '+temp+'C');
		client.publish(topicTemperature, '{ "temperature": '+temp+' }');

		// Retrieve humidity
		htu21d.readHumidity(function (humidity) {
			console.log('Humidity: '+humidity+'%');
			client.publish(topicHumidity, '{ "humidity": '+humidity+' }');
		});
	});
}, timeout);
