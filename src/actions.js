module.exports = {
	initActions: function () {
		let self = this;
		let actions = {};

		actions.flash_device = {
			name: 'Flash All Listener Clients of a Device',
			options: [
				{
					type: 'dropdown',
					label: 'Device',
					id: 'device',
					default: self.devices_array[0].id,
					choices: self.devices_array
				}
			],
			callback: async (event) => {
				for (let i = 0; i < self.listener_clients.length; i++) {
					if (self.listener_clients[i].deviceId === options.device) {
						self.sendCommand('flash', self.listener_clients[i].id);
					}
				}
			}
		};

		actions.flash_listener_client = {
			name: 'Flash A Specific Listener Client',
			options: [
				{
					type: 'dropdown',
					label: 'Listener Client',
					id: 'listener_client',
					default: self.listener_clients_array[0].id,
					choices: self.listener_clients_array
				}
			],
			callback: async (event) => {
				self.sendCommand('flash', event.options.listener_client);
			}
		};

		actions.reassign_listener_client = {
			name: 'Reassign A Specific Listener Client',
			options: [
				{
					type: 'dropdown',
					label: 'Listener Client',
					id: 'listener_client',
					default: self.listener_clients_array[0].id,
					choices: self.listener_clients_array
				},
				{
					type: 'dropdown',
					label: 'Device',
					id: 'device',
					default: self.devices_array[0].id,
					choices: self.devices_array
				}
			],
			callback: async (event) => {
				let oldDeviceId = 'unassigned';
				for (let i = 0; i < self.listener_clients.length; i++) {
					if (self.listener_clients[i].id === event.options.listener_client) {
						oldDeviceId = self.listener_clients[i].deviceId;
					}
				}
				self.sendCommand('reassign', options.listener_client, oldDeviceId, event.options.device);
			}
		};
		
		this.setActionDefinitions(actions);
	}
}