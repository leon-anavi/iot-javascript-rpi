var mqttClient;
// Change the host according to your own setup
var host = "192.168.4.183";
var port = 1884;
var path = "";
var workgroup = "workgroup";

var topicPrefix = "home/room/";
var topicTemperature = topicPrefix + "temperature";
var topicHumidity = topicPrefix + "humidity";
var topicLight = topicPrefix + "light";

function changeColor(red, yellow, green)
{
  var payload = '{ "r": '+red+', "y": '+yellow+', "g": '+green+' }';
  message = new Paho.MQTT.Message(payload);
  message.destinationName = topicLight;
  mqttClient.send(message);
}

function onConnect() {
  console.log("connected");
  $('#txtInfo').removeClass('d-none');
  $('#txtHost').text(host);
  $('#txtPort').text(port);

  mqttClient.subscribe(topicPrefix+"#");
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  try {
    console.log("MQTT message arrive: "+message.destinationName);
    console.log("payload: "+message.payloadString);
    var data = JSON.parse(message.payloadString);

    if (topicTemperature == message.destinationName) {
      $('#txtTemperature').text("Temperature: "+data.temperature+"C");
    }

    if (topicHumidity == message.destinationName) {
      if (0 > data.humidity) {
        // Make sure humitidy never goes below 0%
        data.humidity = 0;
      }
      $('#txtHumidity').text("Humidity: "+data.humidity+"%");
    }
  } catch (e) {
    console.log("Malformed data");
  }
}

$(document).ready(function() {
    var mqttClientId = "MqttDemo" + Math.floor((Math.random() * 1000) + 1);
    mqttClient = new Paho.MQTT.Client(host, Number(port), path, mqttClientId);

    // set callback handlers
    mqttClient.onConnectionLost = onConnectionLost;
    mqttClient.onMessageArrived = onMessageArrived;

    // connect the client
    mqttClient.connect({onSuccess:onConnect, keepAliveInterval: 15});

    $('#buttonColorAll').on('click', function (e) {
         e.preventDefault();
         changeColor(true, true, true);
    });

    $('#buttonColorRed').on('click', function (e) {
         e.preventDefault();
         changeColor(true, false, false);
    });

    $('#buttonColorGreen').on('click', function (e) {
         e.preventDefault();
         changeColor(false, false, true);
    });

    $('#buttonColorYellow').on('click', function (e) {
         e.preventDefault();
         changeColor(false, true, false);
    });

    $('#buttonColorOff').on('click', function (e) {
         e.preventDefault();
         changeColor(false, false, false);
    });
});
