const { combineRgb } = require('@companion-module/base')

module.exports = {
	initFeedbacks: function () {
		let self = this;
		
		let feedbacks = {};

		const foregroundColorWhite = combineRgb(255, 255, 255) // White
		const backgroundColorRed = combineRgb(255, 0, 0) // Red

		feedbacks.sources = {
			type: 'boolean',
			name: 'Source is Offline',
			description: 'If the selected Source goes offline, change the color of the button',
			defaultStyle: {
				color: foregroundColorWhite,
				bgcolor: backgroundColorRed,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Source',
					id: 'source',
					choices: self.sources_array,
					default: self.sources_array[0].id
				},
			],
			callback: function (feedback) {
				let opt = feedback.options;
		
				let source = self.GetSourceBySourceId(feedback.options.source);
				if (source) {
					if (source.connected === false) {
						return true;
					}
				}
		
				return false;
			}
		};

		feedbacks.devices = {
			type: 'boolean',
			name: 'Device In Preview or Program',
			description: 'If Device is in Preview or Program, change the color of the button.',
			defaultStyle: {
				color: foregroundColorWhite,
				bgcolor: backgroundColorRed,
			},
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
			],
			callback: function (feedback) {
				let device = self.GetDeviceByDeviceId(feedback.options.device);
				if (device) {
					switch(feedback.options.mode) {
						case 'preview':
							if (device.mode_preview) {
								return true;
							}
							break;
						case 'program':
							if (device.mode_program) {
								return true;
							}
							break;
						case 'previewprogram':
							if ((device.mode_preview) && (device.mode_program)) {
								return true;
							}
							break;
					}
				}
	
				return false
			}
		};
	
		feedbacks.listener_clients = {
			type: 'boolean',
			name: 'Listener Client Offline',
			description: 'If the selected Listener Client goes offline, change the color of the button',
			options: [
				{
					type: 'dropdown',
					label: 'Listener client',
					id: 'listener_client',
					choices: self.listener_clients_array,
					default: self.listener_clients_array[0].id
				},
			],
			callback: function (feedback) {
				let opt = feedback.options;
	
				let listener_client = self.GetListenerClientById(feedback.options.listener_client);
		
				if (listener_client) {
					if (listener_client.inactive === true) {
						return true;
					}
				}
		
				return false;
			}
		};
	
		feedbacks['tsl_clients'] = {
			type: 'boolean',
			name: 'TSL Client Offline',
			description: 'If the selected TSL Client goes offline, change the color of the button',
			options: [
				{
					type: 'dropdown',
					label: 'TSL Client',
					id: 'tsl_client',
					choices: self.tsl_clients_array,
					default: self.tsl_clients_array[0].id
				}
			],
			callback: function (feedback) {
				let opt = feedback.options;
		
				let tsl_client = self.GetTSLClientById(feedback.options.tsl_client);
				if (tsl_client) {
					if (tsl_client.connected === false) {
						return true;
					}
				}
		
				return false;
			}
		};
	
		feedbackscloud_destinations = {
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
			],
			callback: function (feedback) {
				let opt = feedback.options;
		
				let cloud_destination = self.GetCloudDestinationById(feedback.options.cloud_destination);
				if (cloud_destination) {
					if (cloud_destination.connected === false) {
						return true;
					}
				}
		
				return false;
			}
		};
	

		this.setFeedbackDefinitions(feedbacks);
	}
}