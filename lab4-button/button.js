#! /usr/bin/env node

var gpio = require('onoff').Gpio;
var led = new gpio(26, 'out');
var button = new gpio(10, 'in', 'both', {debounceTimeout: 500});

var status = 0;
// Ensure that the LED is turned off at the beginning
led.writeSync(status);

// Watch for hardware interrupts when the button is pressed
button.watch(function (err, value) { 
	if (err) {
		console.error('Error: ', err); 
		return;
	}
	if (0 == value) {
		// Change the status
		status = (1 == status) ? 0 : 1;
		led.writeSync(status);
		console.log("Button pressed");
  	}
});

function gentleExit() {
	// Remove all hardware interrupt watchers
	button.unwatchAll();
	// Turn off the LED
	led.writeSync(0);
	// Free resources
	led.unexport();
	button.unexport();

	console.log("\nExiting...");
	process.exit();
};

console.log('Please, press the button.');

process.on('SIGINT', gentleExit);
