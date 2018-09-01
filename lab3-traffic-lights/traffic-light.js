#! /usr/bin/env node

var gpio = require('onoff').Gpio;
var red = new gpio(13, 'out');
var yellow = new gpio(19, 'out');
var green = new gpio(26, 'out');
var timeout = 1000;

function stop() {
	red.writeSync(0);
	yellow.writeSync(0);
	green.writeSync(0);
}

function gentleExit() {
	stop();
	red.unexport();
	yellow.unexport();
	green.unexport();
	process.exit();
}

// Handle ctrl+c and exit gently
process.on('SIGINT', gentleExit);

// Ensure that all lights are turned off at the beginning
stop();

counter=1;
setInterval(function() {
	switch(counter) {
		case 1:
			red.writeSync(0);
			yellow.writeSync(0);
			green.writeSync(1);
		break;
		case 2:
			red.writeSync(0);
			yellow.writeSync(1);
			green.writeSync(0);
		break;
		case 3:
			red.writeSync(1);
			yellow.writeSync(0);
			green.writeSync(0);
		break;
	}
	counter = (3 == counter) ? 1 : counter+1;
}, timeout);
