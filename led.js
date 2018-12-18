var awsIot = require('aws-iot-device-sdk');
var rpio = require('rpio');
var PIN = 37;
rpio.open(PIN, rpio.OUTPUT, rpio.LOW);
var device = awsIot.device({
		host: '',
		keyPath: '/home/pi/deviceSDK/certs/private.pem.key',
		certPath: '/home/pi/deviceSDK/certs/certificate.pem.crt',
		caPath: '/home/pi/deviceSDK/certs/caCert.crt',
		clientId: '',
		region: 'us-east-2'
});
function getRandomInt(min,max){
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max-min+1) + min);
}
device.on('connect', function() {

		device.subscribe('LED'); 
});

device.on('message', function(topic, payload){
		var payload = JSON.parse(payload.toString());
		var count = 0;
		var brewType = ['Flat white','Cappuccino','Americano','Latte','Breakfast Blend','Dark Roast'];
		if(topic == 'LED'){
				if(payload.brew == 'start'){
					console.log("Brewing");
					while(count < 8000000)
					{
						rpio.write(PIN,rpio.HIGH);
						count = count + 1;
					}
					rpio.write(PIN, rpio.LOW);
					count = 0;
					console.log("Brew Complete");
					device.publish('BrewComplete', 
						JSON.stringify(
						{date: '12/19/18',
						 type: brewType[getRandomInt(0,5)],
						 userID: getRandomInt(0,65435),
						 devID: getRandomInt(0,23482)
						}));
				}
				else{
						
						
				}
		}
});
