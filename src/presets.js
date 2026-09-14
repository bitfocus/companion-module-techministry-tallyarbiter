const { combineRgb } = require('@companion-module/base')

module.exports = {
	initPresets: function () {
		let self = this
		let presets = []

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
					bgcolor: combineRgb(0, 0, 0),
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
							bgcolor: combineRgb(0, 255, 0),
							fgcolor: combineRgb(255, 255, 255),
						},
					},
					{
						feedbackId: 'devices',
						options: {
							device: self.devices[i].id,
							mode: 'program',
						},
						style: {
							bgcolor: combineRgb(255, 0, 0),
							fgcolor: combineRgb(255, 255, 255),
						},
					},
				],
			})
		}

		for (let i = 0; i < self.devices.length; i++) {
			presets.push({
				type: 'button',
				category: 'Flash a device',
				name: 'device ' + self.devices[i].name,
				style: {
					text: 'Flash ' + self.devices[i].name,
					size: '16',
					color: '16777215',
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [
							{
								actionId: 'flash_device',
								options: {
									device: self.devices[i].id,
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			})
		}

		for (let i = 0; i < self.listener_clients.length; i++) {
			let listenerLabel = self.GetListenerClientLabel(self.listener_clients[i])

			presets.push({
				type: 'button',
				category: 'Flash a listener',
				name: listenerLabel,
				style: {
					text: 'Flash ' + listenerLabel,
					size: '12',
					color: '16777215',
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [
							{
								actionId: 'flash_listener_client',
								options: {
									listener_client: self.listener_clients[i].id,
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			})
		}

		for (let i = 0; i < self.listener_clients.length; i++) {
			let listenerLabel = self.GetListenerClientLabel(self.listener_clients[i])

			presets.push({
				type: 'button',
				category: 'Reassign a listener',
				name: listenerLabel,
				style: {
					text: 'Reassign ' + listenerLabel,
					size: '12',
					color: foregroundColor,
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [
							{
								actionId: 'reassign_listener_client',
								options: {
									listener_client: self.listener_clients[i].id,
									device: self.devices_array[0].id,
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			})
		}

		for (let i = 0; i < self.sources.length; i++) {
			presets.push({
				type: 'button',
				category: 'Sources',
				name: self.sources[i].name,
				style: {
					text: self.sources[i].name,
					size: '14',
					color: foregroundColor,
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [],
				feedbacks: [
					{
						feedbackId: 'sources',
						options: {
							source: self.sources[i].id,
						},
						style: {
							bgcolor: backgroundColorRed,
							fgcolor: foregroundColor,
						},
					},
				],
			})
		}

		for (let i = 0; i < self.bus_options.length; i++) {
			let bus = self.bus_options[i]

			let busColor = combineRgb(255, 165, 0) // orange for bus types other than preview/program (e.g. aux)
			if (bus.type === 'preview') {
				busColor = combineRgb(0, 255, 0)
			} else if (bus.type === 'program') {
				busColor = backgroundColorRed
			}

			presets.push({
				type: 'button',
				category: 'Bus Status',
				name: bus.label,
				style: {
					text: `${bus.label}\n$(${self.label}:bus_${bus.id}_devices)`,
					size: '14',
					color: foregroundColor,
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [],
				feedbacks: [
					{
						feedbackId: 'busActive',
						options: {
							busOption: bus.id,
						},
						style: {
							bgcolor: busColor,
							fgcolor: foregroundColor,
						},
					},
				],
			})
		}

		for (let i = 0; i < self.listener_clients.length; i++) {
			let listenerLabel = self.GetListenerClientLabel(self.listener_clients[i])

			presets.push({
				type: 'button',
				category: 'Listener Client Status',
				name: listenerLabel,
				style: {
					text: listenerLabel,
					size: '12',
					color: foregroundColor,
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [],
				feedbacks: [
					{
						feedbackId: 'listener_clients',
						options: {
							listener_client: self.listener_clients[i].id,
						},
						style: {
							bgcolor: backgroundColorRed,
							fgcolor: foregroundColor,
						},
					},
				],
			})
		}

		for (let i = 0; i < self.tsl_clients.length; i++) {
			presets.push({
				type: 'button',
				category: 'TSL Client Status',
				name: 'tsl ' + self.tsl_clients[i].id,
				style: {
					text: 'TSL ' + self.tsl_clients[i].id,
					size: '12',
					color: foregroundColor,
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [],
				feedbacks: [
					{
						feedbackId: 'tsl_clients',
						options: {
							tsl_client: self.tsl_clients[i].id,
						},
						style: {
							bgcolor: backgroundColorRed,
							fgcolor: foregroundColor,
						},
					},
				],
			})
		}

		for (let i = 0; i < self.cloud_destinations.length; i++) {
			presets.push({
				type: 'button',
				category: 'Cloud Destination Status',
				name: 'cloud ' + self.cloud_destinations[i].id,
				style: {
					text: 'Cloud ' + self.cloud_destinations[i].id,
					size: '12',
					color: foregroundColor,
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [],
				feedbacks: [
					{
						feedbackId: 'cloud_destinations',
						options: {
							cloud_destination: self.cloud_destinations[i].id,
						},
						style: {
							bgcolor: backgroundColorRed,
							fgcolor: foregroundColor,
						},
					},
				],
			})
		}

		this.setPresetDefinitions(presets)
	},
}
