var request = require("request");
var Service, Characteristic;

module.exports = function(homebridge) {

  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  
  homebridge.registerAccessory("homebridge-efergy", "Efergy", EfergyAccessory);
}

function EfergyAccessory(log, config) {
  this.log = log;

  this.accessToken = config["api_token"];
  
  this.service = new Service.EfergyMonitor(this.name);
  
  this.service
    .getCharacteristic(Characteristic.EfergyMonitorState)
    .on('get', this.getState.bind(this));
  
}

LockitronAccessory.prototype.getState = function(callback) {
  this.log("Getting current state...");
  
  request.get({
    url: "https://api.lockitron.com/v2/locks/"+this.lockID,
    qs: { access_token: this.accessToken }
  }, function(err, response, body) {
    
    if (!err && response.statusCode == 200) {
      var json = JSON.parse(body);
      var state = json.state; // "lock" or "unlock"
      this.log("Lock state is %s", state);
      var locked = state == "lock"
      callback(null, locked); // success
    }
    else {
      this.log("Error getting state (status code %s): %s", response.statusCode, err);
      callback(err);
    }
  }.bind(this));
}
  

LockitronAccessory.prototype.getServices = function() {
  return [this.service];
}