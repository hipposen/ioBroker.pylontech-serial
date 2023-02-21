"use strict";

/*
 * Created with @iobroker/create-adapter v2.3.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");
//const { parsers } = require("serialport");
const { SerialPort,ReadlineParser  } = require("serialport");

// Load your modules here, e.g.:
// const fs = require("fs");
let gthis;
let port;

let pylonData = new Array();

class PylontechSerial extends utils.Adapter {

	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */


	constructor(options) {
		super({
			...options,
			name: "pylontech-serial",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		// this.on("objectChange", this.onObjectChange.bind(this));
		// this.on("message", this.onMessage.bind(this));
		this.on("unload", this.onUnload.bind(this));
		gthis = this;
		let rawData;
		let myTimer;
		
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
		 stringToBoolean = (stringValue) => {
		switch(stringValue?.toLowerCase()?.trim()){
			case "true": 
			case "yes": 
			case "1": 
			case "y": 
			  return true;
	
			case "false": 
			case "no": 
			case "n": 
			case "0": 
			case null: 
			case undefined:
			  return false;
	
			default: 
			  return JSON.parse(stringValue);
		}
	}

	async onReady() {
		// Initialize your adapter here
		const parser = new ReadlineParser();
		port = new SerialPort({path: this.config.device, baudRate: this.config.baudRate,  autoOpen: false });
		port.pipe(parser);
		// The adapters config (in the instance object everything under the attribute "native") is accessible via
		// this.config:
		this.log.info("config Serial-Device: " + this.config.device);
		this.log.info("config BaudRate: " + this.config.baudRate);
		await this.setObjectNotExistsAsync("Master", {
			type: 'device',
			common: {
				name: "first battery",
				}
			});
		port.on("open", function() {
			gthis.log.info(" Port Open ");			
			port.write("bat\n");
			
		});

		port.on("error", function(err) {
			gthis.log.error(" Port Error: " + err.message);
		});

		port.on("close", function() {
			gthis.log.info(" Port Close ");						
		});

		port.on("data", function(data) {
			//gthis.log.info(" Port Data " + data.toString());						
		});

		port.on("drain", function() {
			gthis.log.info(" Port Drain ");						
		});


		parser.on("data",  function (data) {
			data = data.trim();
			const parts = data.split(" ");

			if ( parts[0].toString() === "bat" ){
				return ;
			}

			if ( parts[0].toString() === "@" ){
				return ;
			}

			if ( parts[0].toString() === "$$" ){
				return ;
			}

			if ( parts[0].toString() === "Command" ){
				return ;
			}

			if ( parts[0].toString() === "Battery" ){
				return ;
			}

			if ( parts[0].toString() === "pylon>bat" ){
				return ;
			}
			//const [nr, volt, amp, temp,Mode,Stat1,Stat2,Stat3,SOC,Power,,BAL] = data
			let rawData = data.replace(/\s+/g, " ").trim().split(" ");
			 

			 gthis.setObjectNotExists("Master."+rawData[0].padStart(2, '0'), {
				type: 'channel',
				common: {
					name: "Cell number",
					"read": true,
					"type": "number"
					}
				});
				
			gthis.setObjectNotExists("Master."+rawData[0].padStart(2, '0')+".volt", {
				type: 'state',
				common: {
					name: "Spannung",
					"read": true,
					"type": "number",
					"unit": "V",
					"custom": {
						"influxdb.0": {
						  "enabled": true,
						  "storageType": "",
						  "aliasId": "",
						  "debounceTime": 0,
						  "blockTime": 0,
						  "changesOnly": false,
						  "changesRelogInterval": 0,
						  "changesMinDelta": 0,
						  "ignoreBelowNumber": "",
						  "disableSkippedValueLogging": false,
						  "enableDebugLogs": false,
						  "debounce": 1000
						}
					  }
					}
				});
			gthis.setStateAsync("Master."+rawData[0].padStart(2, '0')+".volt", {val: parseFloat(rawData[1]/1000), ack: true});
			
			gthis.setObjectNotExists("Master."+rawData[0].padStart(2, '0')+".amp", {
				type: 'state',
					common: {
						name: "Stromstärke",
						"read": true,
						"type": "number",
						"unit": "A",
						"custom": {
							"influxdb.0": {
							  "enabled": true,
							  "storageType": "",
							  "aliasId": "",
							  "debounceTime": 0,
							  "blockTime": 0,
							  "changesOnly": false,
							  "changesRelogInterval": 0,
							  "changesMinDelta": 0,
							  "ignoreBelowNumber": "",
							  "disableSkippedValueLogging": false,
							  "enableDebugLogs": false,
							  "debounce": 1000
							}
						  }
					}
				});
			gthis.setStateAsync("Master."+rawData[0].padStart(2, '0')+".amp", {val: parseFloat(rawData[2]/1000), ack: true});

			gthis.setObjectNotExists("Master."+rawData[0].padStart(2, '0')+".temp", {
				type: 'state',
					common: {
							name: "Temperature",
							"read": true,
							"type": "number",
							"unit": "C",
							"custom": {
								"influxdb.0": {
								  "enabled": true,
								  "storageType": "",
								  "aliasId": "",
								  "debounceTime": 0,
								  "blockTime": 0,
								  "changesOnly": false,
								  "changesRelogInterval": 0,
								  "changesMinDelta": 0,
								  "ignoreBelowNumber": "",
								  "disableSkippedValueLogging": false,
								  "enableDebugLogs": false,
								  "debounce": 1000
								}
							  }
					}
				});
			gthis.setStateAsync("Master."+rawData[0].padStart(2, '0')+".temp", {val: parseFloat(rawData[3]/1000), ack: true});

			gthis.setObjectNotExists("Master."+rawData[0].padStart(2, '0')+".mode", {
				type: 'state',
					common: {
							name: "mode",
							"read": true,
							"type": "string","custom": {
								"influxdb.0": {
								  "enabled": true,
								  "storageType": "",
								  "aliasId": "",
								  "debounceTime": 0,
								  "blockTime": 0,
								  "changesOnly": false,
								  "changesRelogInterval": 0,
								  "changesMinDelta": 0,
								  "ignoreBelowNumber": "",
								  "disableSkippedValueLogging": false,
								  "enableDebugLogs": false,
								  "debounce": 1000
								}
							  }
					}
				});
			gthis.setStateAsync("Master."+rawData[0].padStart(2, '0')+".mode", {val: rawData[4], ack: true});
			
			gthis.setObjectNotExists("Master."+rawData[0].padStart(2, '0')+".soc", {
				type: 'state',
					common: {
							name: "State of Charge",
							"read": true,
							"type": "number",
							"unit": "%",
							"custom": {
								"influxdb.0": {
								  "enabled": true,
								  "storageType": "",
								  "aliasId": "",
								  "debounceTime": 0,
								  "blockTime": 0,
								  "changesOnly": false,
								  "changesRelogInterval": 0,
								  "changesMinDelta": 0,
								  "ignoreBelowNumber": "",
								  "disableSkippedValueLogging": false,
								  "enableDebugLogs": false,
								  "debounce": 1000
								}
							  }

					}
				});
			gthis.setStateAsync("Master."+rawData[0].padStart(2, '0')+".soc", {val: parseInt(rawData[8]), ack: true});
			
			gthis.setObjectNotExists("Master."+rawData[0].padStart(2, '0')+".power", {
				type: 'state',
					common: {
							name: "Power",
							"read": true,
							"type": "number",
							"unit": "Ah",
							"custom": {
								"influxdb.0": {
								  "enabled": true,
								  "storageType": "",
								  "aliasId": "",
								  "debounceTime": 0,
								  "blockTime": 0,
								  "changesOnly": false,
								  "changesRelogInterval": 0,
								  "changesMinDelta": 0,
								  "ignoreBelowNumber": "",
								  "disableSkippedValueLogging": false,
								  "enableDebugLogs": false,
								  "debounce": 1000
								}
							  }
					}
				});
			gthis.setStateAsync("Master."+rawData[0].padStart(2, '0')+".power", {val: parseFloat(rawData[9]/1000), ack: true});
			
			gthis.setObjectNotExists("Master."+rawData[0].padStart(2, '0')+".balance", {
				type: 'state',
					common: {
							name: "Balance",
							"read": true,
							"type": "boolean",
							"custom": {
								"influxdb.0": {
								  "enabled": true,
								  "storageType": "",
								  "aliasId": "",
								  "debounceTime": 0,
								  "blockTime": 0,
								  "changesOnly": false,
								  "changesRelogInterval": 0,
								  "changesMinDelta": 0,
								  "ignoreBelowNumber": "",
								  "disableSkippedValueLogging": false,
								  "enableDebugLogs": false,
								  "debounce": 1000
								}
							  }
					}
				});
			gthis.setStateAsync("Master."+rawData[0].padStart(2, '0')+".balance", {val: gthis.stringToBoolean(rawData[11]), ack: true});


			//gthis.log.info(data.length);
			//gthis.log.info(data);
	
			//pylonData.push(rawData);
			
		});

		gthis.Timer = setInterval(() => {
			if(port.isOpen){
				port.write("bat\n");
			}
			else{
	
				port.open();

			}	
		  }, 60000);
		
		
		
		//await this.getDatafromRaw()
		
		/*
		For every state in the system there has to be also an object of type state
		Here a simple template for a boolean variable named "testVariable"
		Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
		*/
/*
		await this.setObjectNotExistsAsync("testVariable", {
			type: "state",
			common: {
				name: "testVariable",
				type: "boolean",
				role: "indicator",
				read: true,
				write: true,
			},
			native: {},
		});
*/
		// In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
		//this.subscribeStates("testVariable");
		// You can also add a subscription for multiple states. The following line watches all states starting with "lights."
		// this.subscribeStates("lights.*");
		// Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
		// this.subscribeStates("*");

		/*
			setState examples
			you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
		*/
		// the variable testVariable is set to true as command (ack=false)
		//await this.setStateAsync("testVariable", true);

		// same thing, but the value is flagged "ack"
		// ack should be always set to true if the value is received from or acknowledged from the target system
		//await this.setStateAsync("testVariable", { val: true, ack: true });

		// same thing, but the state is deleted after 30s (getState will return null afterwards)
		//await this.setStateAsync("testVariable", { val: true, ack: true, expire: 30 });

		// examples for the checkPassword/checkGroup functions
		//let result = await this.checkPasswordAsync("admin", "iobroker");
		//this.log.info("check user admin pw iobroker: " + result);

		//result = await this.checkGroupAsync("admin", "admin");
		//this.log.info("check group user admin group admin: " + result);
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			this.log.info("cleaned everything up...");
			port.close();
			clearInterval(gthis.Timer);
			callback();
		} catch (e) {
			callback();
		}
	}

	// If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
	// You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
	// /**
	//  * Is called if a subscribed object changes
	//  * @param {string} id
	//  * @param {ioBroker.Object | null | undefined} obj
	//  */
	// onObjectChange(id, obj) {
	// 	if (obj) {
	// 		// The object was changed
	// 		this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
	// 	} else {
	// 		// The object was deleted
	// 		this.log.info(`object ${id} deleted`);
	// 	}
	// }

	/**
	 * Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */
	onStateChange(id, state) {
		if (state) {
			// The state was changed
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
		} else {
			// The state was deleted
			this.log.info(`state ${id} deleted`);
		}
	}

	// If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
	// /**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires "common.messagebox" property to be set to true in io-package.json
	//  * @param {ioBroker.Message} obj
	//  */
	// onMessage(obj) {
	// 	if (typeof obj === "object" && obj.message) {
	// 		if (obj.command === "send") {
	// 			// e.g. send email or pushover or whatever
	// 			this.log.info("send command");

	// 			// Send response in callback if required
	// 			if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
	// 		}
	// 	}
	// }

}

if (require.main !== module) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new PylontechSerial(options);
} else {
	// otherwise start the instance directly
	new PylontechSerial();
}
