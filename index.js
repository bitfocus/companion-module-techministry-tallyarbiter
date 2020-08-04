// TechMinistry-Orator

var instance_skel = require('../../instance_skel');
var debug;
var log;

var io = require('socket.io-client');
var socket = null;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions
	
	return self;
}

instance.prototype.sources = [];
instance.prototype.devices = [];
instance.prototype.bus_options = [];

instance.prototype.listener_clients = [];
instance.prototype.cloud_destinations = [];
instance.prototype.tsl_clients = [];

instance.prototype.init = function () {
	var self = this;

	debug = self.debug;
	log = self.log;

	self.status(self.STATUS_OK);

	self.initVariables();
	
	self.initModule();
};

instance.prototype.updateConfig = function (config) {
	var self = this;
	self.config = config;

	self.status(self.STATUS_OK);

	self.initModule();
};

instance.prototype.initVariables = function () {
	var self = this;

	var variables = [
		{
			label: 'Variable Label',
			name:  'variableName'
		}
	];

	self.setVariableDefinitions(variables);
};

instance.prototype.updateVariable = function (variableName, value) {
	var self = this;
	
	self.setVariable(variableName, value);
};

instance.prototype.initFeedbacks = function() {
	var self = this;
	
	// feedbacks
	var feedbacks = {};

	feedbacks['sources'] = {
		label: 'Source Offline',
		description: 'If the selected Source goes offline, change the color of the button',
		options: [
			{
				type: 'dropdown',
				label: 'Source',
				id: 'source',
				choices: self.sources_array,
				default: self.sources_array[0].id
			},
			{
				type: 'colorpicker',
				label: 'Foreground color',
				id: 'fg',
				default: self.rgb(255,255,255)
			},
			{
				type: 'colorpicker',
				label: 'Background color',
				id: 'bg',
				default: self.rgb(255,0,0)
			},
		]
	};

	feedbacks['devices'] = {
		label: 'Device In Preview or Program',
		description: 'If Device is in Preview, change the color of the button.',
		options: [
			{
				type: 'dropdown',
				label: 'Device',
				id: 'device',
				choices: self.devices_array,
				default: self.devices_array[0].id
			},
			{
				type: 'dropdown',
				label: 'Mode',
				id: 'mode',
				choices: [ { id: 'preview', label: 'Preview' }, { id: 'program', label: 'Program' }, { id: 'previewprogram', label: 'Preview + Program' } ] 
			},
			{
				type: 'colorpicker',
				label: 'Foreground color',
				id: 'fg',
				default: self.rgb(255,255,255)
			},
			{
				type: 'colorpicker',
				label: 'Background color',
				id: 'bg',
				default: self.rgb(0,255,0)
			},
		]
	};

	feedbacks['listener_clients'] = {
		label: 'Listener Client Offline',
		description: 'If the selected Listener Client goes offline, change the color of the button',
		options: [
			{
				type: 'dropdown',
				label: 'Listener client',
				id: 'listener_client',
				choices: self.listener_clients_array,
				default: self.listener_clients_array[0].id
			},
			{
				type: 'colorpicker',
				label: 'Foreground color',
				id: 'fg',
				default: self.rgb(255,255,255)
			},
			{
				type: 'colorpicker',
				label: 'Background color',
				id: 'bg',
				default: self.rgb(255,0,0)
			},
		]
	};

	feedbacks['tsl_clients'] = {
		label: 'TSL Client Offline',
		description: 'If the selected TSL Client goes offline, change the color of the button',
		options: [
			{
				type: 'dropdown',
				label: 'TSL Client',
				id: 'tsl_client',
				choices: self.tsl_clients_array,
				default: self.tsl_clients_array[0].id
			},
			{
				type: 'colorpicker',
				label: 'Foreground color',
				id: 'fg',
				default: self.rgb(255,255,255)
			},
			{
				type: 'colorpicker',
				label: 'Background color',
				id: 'bg',
				default: self.rgb(255,0,0)
			},
		]
	};

	feedbacks['cloud_destinations'] = {
		label: 'Cloud Destination Offline',
		description: 'If the selected Cloud Destination goes offline, change the color of the button',
		options: [
			{
				type: 'dropdown',
				label: 'Cloud Destination',
				id: 'cloud_destination',
				choices: self.cloud_destinations_array,
				default: self.cloud_destinations_array[0].id
			},
			{
				type: 'colorpicker',
				label: 'Foreground color',
				id: 'fg',
				default: self.rgb(255,255,255)
			},
			{
				type: 'colorpicker',
				label: 'Background color',
				id: 'bg',
				default: self.rgb(255,0,0)
			},
		]
	};

	self.setFeedbackDefinitions(feedbacks);
}

instance.prototype.feedback = function(feedback, bank) {
	var self = this;

	if (feedback.type === 'sources') {
		let source = self.GetSourceBySourceId(feedback.options.source);
		if (source) {
			if (source.connected === false) {
				return { color: feedback.options.fg, bgcolor: feedback.options.bg };
			}
		}
	}

	if (feedback.type === 'devices') {
		let device = self.GetDeviceByDeviceId(feedback.options.device);
		if (device) {
			switch(feedback.options.mode) {
				case 'preview':
					if (device.mode_preview) {
						return { color: feedback.options.fg, bgcolor: feedback.options.bg };
					}
					break;
				case 'program':
					if (device.mode_program) {
						return { color: feedback.options.fg, bgcolor: feedback.options.bg };
					}
					break;
				case 'previewprogram':
					if ((device.mode_preview) && (device.mode_program)) {
						return { color: feedback.options.fg, bgcolor: feedback.options.bg };
					}
					break;
			}
		}
	}

	if (feedback.type === 'listener_clients') {
		let listener_client = self.GetListenerClientById(feedback.options.listener_client);
		if (listener_client) {
			if (listener_client.inactive === true) {
				return { color: feedback.options.fg, bgcolor: feedback.options.bg };
			}
		}
	}

	if (feedback.type === 'tsl_clients') {
		let tsl_client = self.GetTSLClientById(feedback.options.tsl_client);
		if (tsl_client) {
			if (tsl_client.connected === false) {
				return { color: feedback.options.fg, bgcolor: feedback.options.bg };
			}
		}
	}

	if (feedback.type === 'cloud_destinations') {
		let cloud_destination = self.GetCloudDestinationById(feedback.options.cloud_destination);
		if (cloud_destination) {
			if (cloud_destination.connected === false) {
				return { color: feedback.options.fg, bgcolor: feedback.options.bg };
			}
		}
	}

	return {};
}

instance.prototype.initModule = function () {
	var self = this;
	
	self.sources = [];
	self.sources_array = [
		{id: '0', label: '(Select a Source)'}
	];

	self.devices = [];
	self.devices_array = [
		{id: '0', label: '(Select a Device)'}
	];

	self.bus_options = [];
	self.device_sources = [];
	self.device_states = [];

	self.listener_clients = [];
	self.listener_clients_array = [
		{id: '0', label: '(Select a Listener Client)'}
	];

	self.tsl_clients = [];
	self.tsl_clients_array = [
		{id: '0', label: '(Select a TSL Client)'}
	];

	self.cloud_destinations = [];
	self.cloud_destinations_array = [
		{id: '0', label: '(Select a Cloud Destination)'}
	];
	
	if (self.config.host) {		
		socket = io.connect('http://' + self.config.host + ':' + self.config.port, {reconnection: true});

		// Add a connect listener
		socket.on('connect', function() { 
			socket.emit('companion');
		});
		
		socket.on('sources', function(data) {
			self.sources = data;
			self.sources_array = [
				{id: '0', label: '(Select a Source)'}
			];
			for (let i = 0; i < self.sources.length; i++) {
				self.updateVariable('source_' + self.sources[i].id + '_name', self.sources[i].name);
				let sourceObj = {};
				sourceObj.id = self.sources[i].id;
				sourceObj.label = self.sources[i].name;
				self.sources_array.push(sourceObj);
			}
			self.initFeedbacks();
			self.checkFeedbacks('sources');
		});

		socket.on('devices', function(data) {
			self.devices = data;
			self.devices_array = [
				{id: '0', label: '(Select a Device)'}
			];
			for (let i = 0; i < self.devices.length; i++) {
				self.updateVariable('device_' + self.devices[i].id + '_name', self.devices[i].name);
				let deviceObj = {};
				deviceObj.id = self.devices[i].id;
				deviceObj.label = self.devices[i].name;
				self.devices_array.push(deviceObj);
			}
			self.initFeedbacks();
			self.actions();
		});

		socket.on('bus_options', function(data) {
			self.bus_options = data;
		});

		socket.on('device_sources', function(data) {
			self.device_sources = data;
		});

		socket.on('device_states', function(data) {
			self.device_states = data;

			for (let i = 0; i < self.devices.length; i++) {
				let mode_preview = false;
				let mode_program = false;
	
				for (let j = 0; j < self.device_states.length; j++) {
					if ((self.device_states[j].deviceId === self.devices[i].id) && (self.GetBusById(self.device_states[j].busId).type === 'preview')) {
						if (self.device_states[j].sources.length > 0) {
							mode_preview = true;
						}
						else {
							mode_preview = false;
						}
					}
					else if ((self.device_states[j].deviceId === self.devices[i].id) && (self.GetBusById(self.device_states[j].busId).type === 'program')) {
						if (self.device_states[j].sources.length > 0) {
							mode_program = true;
						}
						else {
							mode_program = false;
						}
					}
				}

				self.devices[i].mode_preview = mode_preview;
				self.devices[i].mode_program = mode_program;
			}

			self.checkFeedbacks('devices');
		});

		socket.on('listener_clients', function(data) {
			self.listener_clients = data;

			self.listener_clients_array = [
				{id: '0', label: '(Select a Listener Client)'}
			];
			for (let i = 0; i < self.listener_clients.length; i++) {
				if (self.listener_clients[i].inactive === false) {
					let listenerClientObj = {};
					listenerClientObj.id = self.listener_clients[i].id;
					listenerClientObj.label = `${self.GetDeviceByDeviceId(self.listener_clients[i].deviceId).name} - ${self.listener_clients[i].ipAddress} (${self.listener_clients[i].listenerType})`;
					self.listener_clients_array.push(listenerClientObj);
				}
			}

			self.actions();
			self.initFeedbacks();
			self.checkFeedbacks('listener_clients');
		});

		socket.on('tsl_clients', function(data) {
			self.tsl_clients = data;

			self.tsl_clients_array = [
				{id: '0', label: '(Select a TSL Client)'}
			];
			for (let i = 0; i < self.tsl_clients.length; i++) {
				let tslClientObj = {};
				tslClientObj.id = self.tsl_clients[i].id;
				tslClientObj.label = `${self.tsl_clients[i].ip}:${self.tsl_clients[i].port} (${self.tsl_clients[i].transport})`;
				self.tsl_clients_array.push(tslClientObj);
			}
			self.initFeedbacks();
			self.checkFeedbacks('tsl_clients');
		});

		socket.on('cloud_destinations', function(data) {
			self.cloud_destinations = data;

			self.cloud_destinations_array = [
				{id: '0', label: '(Select a Cloud Destination)'}
			];
			for (let i = 0; i < self.cloud_destinations.length; i++) {
				let cloudDestinationObj = {};
				cloudDestinationObj.id = self.cloud_destinations[i].id;
				cloudDestinationObj.label = `${self.cloud_destinations[i].host}:${self.cloud_destinations[i].port}`;
				self.cloud_destinations_array.push(cloudDestinationObj);
			}
			self.initFeedbacks();
			self.checkFeedbacks('cloud_destinations');
		});
	}
	
	self.actions(); // export actions
};

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;

	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'You will need to have the Tally Arbiter program running on the remote computer.'
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 6,
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Target Port',
			default: 4455,
			width: 4,
			regex: self.REGEX_PORT
		}
	]
}

// When module gets deleted
instance.prototype.destroy = function () {
	var self = this;
	socket.close();
	debug('destroy', self.id);
}

instance.prototype.actions = function (system) {
	var self = this;

	self.TallyArbiterActions = {
		'flash_device': {
			label: 'Flash All Listener Clients of a Device',
			options: [
				{
					type: 'dropdown',
					label: 'Device',
					id: 'device',
					choices: self.devices_array
				}
			]
		},
		'flash_listener_client': {
			label: 'Flash A Specific Listener Client',
			options: [
				{
					type: 'dropdown',
					label: 'Listener Client',
					id: 'listener_client',
					choices: self.listener_clients_array
				}
			]
		}
	};
					
	self.system.emit('instance_actions', self.id, self.TallyArbiterActions );
};

instance.prototype.action = function (action) {
	var self = this;
	var options = action.options;

	switch (action.action) {
		case 'flash_device':
			for (let i = 0; i < self.listener_clients.length; i++) {
				if (self.listener_clients[i].deviceId === options.device) {
					socket.emit('flash', self.listener_clients[i].id);
				}
			}
		case 'flash_listener_client':
			socket.emit('flash', options.listener_client);
			break;
		default:
			break;
	}
};

instance.prototype.GetSourceBySourceId = function (sourceId) {
	//gets the Source object by id
	var self = this;
	return self.sources.find( ({ id }) => id === sourceId);
}

instance.prototype.GetBusById = function (busId) {
	//gets the Bus object by id
	var self = this;
	return self.bus_options.find( ({ id }) => id === busId);
}

instance.prototype.GetDeviceByDeviceId = function (deviceId) {
	//gets the Device object by id
	var self = this;
	return self.devices.find( ({ id }) => id === deviceId);
}

instance.prototype.GetListenerClientById = function (listenerClientId) {
	//gets the Listner Client object by id
	var self = this;
	return self.listener_clients.find( ({ id }) => id === listenerClientId);
}

instance.prototype.GetTSLClientById = function (tslClientId) {
	//gets the TSL Client object by id
	var self = this;
	return self.tsl_clients.find( ({ id }) => id === tslClientId);
}

instance.prototype.GetCloudDestinationById = function (cloudDestinationId) {
	//gets the Cloud Desination object by id
	var self = this;
	return self.cloud_destinations.find( ({ id }) => id === cloudDestinationId);
}

instance_skel.extendedBy(instance);
exports = module.exports = instance;
