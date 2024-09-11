module.exports = {
	// ##########################
	// #### Define Variables ####
	// ##########################
	initVariables: function () {
		let variables = []

		for (let i = 0; i < this.sources.length; i++) {
			variables.push({
				name: 'Source ' + this.sources[i].id + ' Name',
				variableId: 'source_' + this.sources[i].id + '_name',
			})
		}

		for (let i = 0; i < this.devices.length; i++) {
			variables.push({
				name: 'Device ' + this.devices[i].id + ' Name',
				variableId: 'device_' + this.devices[i].id + '_name',
			})
		}

		variables.push({ name: 'Total Sources', variableId: 'total_sources' })
		variables.push({ name: 'Total Devices', variableId: 'total_devices' })
		variables.push({ name: 'Total Listener Clients', variableId: 'total_listener_clients' })
		variables.push({ name: 'Total TSL Clients', variableId: 'total_tsl_clients' })
		variables.push({ name: 'Total Cloud Destinations', variableId: 'total_cloud_destinations' })

		this.setVariableDefinitions(variables)
	},

	// #########################
	// #### Check Variables ####
	// #########################
	checkVariables: function () {
		let self = this

		try {
			let variableObj = {}

			for (let i = 0; i < this.sources.length; i++) {
				variableObj['source_' + this.sources[i].id + '_name'] = this.sources[i].name
			}

			for (let i = 0; i < this.devices.length; i++) {
				variableObj['device_' + this.devices[i].id + '_name'] = this.devices[i].name
			}

			variableObj['total_sources'] = this.sources.length
			variableObj['total_devices'] = this.devices.length
			variableObj['total_listener_clients'] = this.listener_clients.length
			variableObj['total_tsl_clients'] = this.tsl_clients.length
			variableObj['total_cloud_destinations'] = this.cloud_destinations.length

			this.setVariableValues(variableObj)
		} catch (error) {
			this.log('error', 'Error setting Variables: ' + String(error))
		}
	},
}
