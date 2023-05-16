const { combineRgb } = require('@companion-module/base')

module.exports = {
	initPresets: function () {
		let self = this;
		let presets = [];

		const foregroundColor = combineRgb(255, 255, 255) // White
		const backgroundColorRed = combineRgb(255, 0, 0) // Red

		for (let i = 0; i < self.devices.length; i++) {
			presets.push({
				type: 'button',
				category: 'Devices',
				name: self.devices[i].name,
				style: {
					text: self.devices[i].name,
					size: '14',
					color: '16777215',
					bgcolor: combineRgb(0,0,0)
				},
				steps: [],
				feedbacks: [
					{
						feedbackId: 'devices',
						options: {
							device: self.devices[i].id,
							mode: 'preview',
						},
						style: {
							bgcolor: combineRgb(0,255,0),
							fgcolor: combineRgb(255,255,255)
						}
					},
					{
						feedbackId: 'devices',
						options: {
							device: self.devices[i].id,
							mode: 'program',
						},
						style: {
							bgcolor: combineRgb(255,0,0),
							fgcolor: combineRgb(255,255,255)
						}
					}
				]
			});
		}
	
		for (let i = 0; i < self.devices.length; i++) {
			presets.push({
				type: 'button',
				category: 'Flash a device',
				name: 'device '+self.devices[i].name,
				style: {
					text: 'Flash '+self.devices[i].name,
					size: '16',
					color: '16777215',
					bgcolor: combineRgb(0,0,0)
				},
				steps: [
					{
						down: [
							{
								actionId: 'flash_device',
								options: {
									device: self.devices[i].id,
								}
							}
						],
						up: []
					}
				],
				feedbacks: []
			});
		}
	
		for (let i = 0; i < self.listener_clients.length; i++) {
			presets.push({
				type: 'button',
				category: 'Flash a listener',
				name: 'listener '+self.listener_clients[i].id,
				style: {
					text: 'Flash '+self.listener_clients[i].id,
					size: '12',
					color: '16777215',
					bgcolor: combineRgb(0,0,0)
				},
				steps: [
					{
						down: [
							{
								actionId: 'flash_listener_client',
								options: {
									listener_client: self.listener_clients[i].id,
								}
							}
						],
						up: []
					}
				],
				feedbacks: []
			});
		}
	
		this.setPresetDefinitions(presets);
	}
}