module.exports = {
	GetSourceBySourceId: function (sourceId) {
		//gets the Source object by id
		return this.sources.find(({ id }) => id === sourceId)
	},

	GetBusById: function (busId) {
		//gets the Bus object by id
		return this.bus_options.find(({ id }) => id === busId)
	},

	GetDeviceByDeviceId: function (deviceId) {
		//gets the Device object by id
		return this.devices.find(({ id }) => id === deviceId)
	},

	GetListenerClientById: function (listenerClientId) {
		//gets the Listner Client object by id
		return this.listener_clients.find(({ id }) => id === listenerClientId)
	},

	GetTSLClientById: function (tslClientId) {
		//gets the TSL Client object by id
		return this.tsl_clients.find(({ id }) => id === tslClientId)
	},

	GetCloudDestinationById: function (cloudDestinationId) {
		//gets the Cloud Desination object by id
		return this.cloud_destinations.find(({ id }) => id === cloudDestinationId)
	},

	GetListenerClientLabel: function (listenerClient) {
		//builds a human-readable label for a Listener Client, e.g. "Cam 01 - 192.168.1.50 (web)"
		let device = this.GetDeviceByDeviceId(listenerClient.deviceId)
		return `${device ? device.name : 'Unknown Device'} - ${listenerClient.ipAddress} (${listenerClient.listenerType})`
	},
}
