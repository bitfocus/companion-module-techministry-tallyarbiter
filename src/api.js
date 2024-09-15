const { InstanceStatus } = require('@companion-module/base')

const io = require('socket.io-client')

module.exports = {
	initConnection() {
		let self = this

		self.sources = []
		self.sources_array = [{ id: '0', label: '(Select a Source)' }]

		self.devices = []
		self.devices_array = [{ id: '0', label: '(Select a Device)' }]

		self.bus_options = []
		self.device_sources = []
		self.device_states = []

		self.listener_clients = []
		self.listener_clients_array = [{ id: '0', label: '(Select a Listener Client)' }]

		self.tsl_clients = []
		self.tsl_clients_array = [{ id: '0', label: '(Select a TSL Client)' }]

		self.cloud_destinations = []
		self.cloud_destinations_array = [{ id: '0', label: '(Select a Cloud Destination)' }]

		if (self.config.host) {
			self.log('info', `Opening connection to Tally Arbiter: ${self.config.host}:${self.config.port}`)

			self.socket = io.connect('http://' + self.config.host + ':' + self.config.port, { reconnection: true })

			// Add listeners
			self.socket.on('connect', function () {
				self.log('info', 'Connected to Tally Arbiter. Retrieving data.')
				self.updateStatus(InstanceStatus.Ok)
				self.socket.emit('companion')
			})

			self.socket.on('disconnect', function () {
				self.updateStatus(InstanceStatus.ConnectionFailure)
				self.log('error', 'Disconnected from Tally Arbiter.')
				self.checkVariables()
			})

			self.socket.on('version', function (version) {
				self.STATUS.version = version
				self.checkVariables()
			})

			self.socket.on('sources', function (data) {
				self.sources = data
				self.sources_array = [{ id: '0', label: '(Select a Source)' }]
				for (let i = 0; i < self.sources.length; i++) {
					let sourceObj = {}
					sourceObj.id = self.sources[i].id
					sourceObj.label = self.sources[i].name
					self.sources_array.push(sourceObj)
				}
				self.initVariables()
				self.initFeedbacks()

				self.checkVariables()
				self.checkFeedbacks('sources')
			})

			self.socket.on('devices', function (data) {
				self.devices = data
				self.devices_array = [{ id: '0', label: '(Select a Device)' }]
				for (let i = 0; i < self.devices.length; i++) {
					let deviceObj = {}
					deviceObj.id = self.devices[i].id
					deviceObj.label = self.devices[i].name
					self.devices_array.push(deviceObj)
				}

				self.initActions()
				self.initVariables()
				self.initFeedbacks()
				self.initPresets()

				self.checkVariables()
			})

			self.socket.on('bus_options', function (data) {
				self.bus_options = data

				if (data.length === 0) {
					self.CHOICES_BUS_OPTIONS = [{ id: '0', label: '(no bus options available)' }]
				}

				for (let i = 0; i < self.bus_options.length; i++) {
					let busOptionObj = {}
					busOptionObj.id = self.bus_options[i].id
					busOptionObj.label = self.bus_options[i].label
					self.CHOICES_BUS_OPTIONS.push(busOptionObj)
				}

				self.initFeedbacks() //rebuilt feedbacks because of bus option choices
				self.initVariables() //rebuilt variables because of bus option choices
			})

			self.socket.on('device_sources', function (data) {
				self.device_sources = data
			})

			self.socket.on('device_states', function (data) {
				self.device_states = data

				for (let i = 0; i < self.devices?.length; i++) {
					let mode_preview = false
					let mode_program = false

					for (let j = 0; j < self.device_states.length; j++) {
						if (
							self.device_states[j].deviceId === self.devices[i].id &&
							self.GetBusById(self.device_states[j].busId).type === 'preview'
						) {
							if (self.device_states[j].sources.length > 0) {
								mode_preview = true
							} else {
								mode_preview = false
							}
						} else if (
							self.device_states[j].deviceId === self.devices[i].id &&
							self.GetBusById(self.device_states[j].busId).type === 'program'
						) {
							if (self.device_states[j].sources.length > 0) {
								mode_program = true
							} else {
								mode_program = false
							}
						}
					}

					self.devices[i].mode_preview = mode_preview
					self.devices[i].mode_program = mode_program
				}

				self.checkFeedbacks('devices')
				self.checkFeedbacks('deviceinBus')

				//bus options variables
				let variableObj = {}

				for (let i = 0; i < self.bus_options.length; i++) {
					variableObj['bus_' + self.bus_options[i].id + '_name'] = self.bus_options[i].label

					//current sources
					let currenDevicesArray = []
					for (let j = 0; j < self.device_states.length; j++) {
						if (self.device_states[j].busId === self.bus_options[i].id && self.device_states[j].sources.length > 0) {
							let device = self.GetDeviceByDeviceId(self.device_states[j].deviceId)
							if (device) {
								currenDevicesArray.push(device.name)
							}
						}
					}

					let currentDevices = currenDevicesArray.join(', ')
					variableObj['bus_' + self.bus_options[i].id + '_devices'] = currentDevices
				}

				self.setVariableValues(variableObj)
			})

			self.socket.on('listener_clients', function (data) {
				self.listener_clients = data

				self.listener_clients_array = [{ id: '0', label: '(Select a Listener Client)' }]
				for (let i = 0; i < self.listener_clients.length; i++) {
					if (self.listener_clients[i].inactive === false) {
						let listenerClientObj = {}
						listenerClientObj.id = self.listener_clients[i].id
						listenerClientObj.label = `${self.GetDeviceByDeviceId(self.listener_clients[i].deviceId).name} - ${self.listener_clients[i].ipAddress} (${self.listener_clients[i].listenerType})`
						self.listener_clients_array.push(listenerClientObj)
					}
				}

				self.initActions()
				self.initPresets()
				self.initFeedbacks()
				self.checkFeedbacks('listener_clients')
			})

			self.socket.on('tsl_clients', function (data) {
				self.tsl_clients = data

				self.tsl_clients_array = [{ id: '0', label: '(Select a TSL Client)' }]
				for (let i = 0; i < self.tsl_clients.length; i++) {
					let tslClientObj = {}
					tslClientObj.id = self.tsl_clients[i].id
					tslClientObj.label = `${self.tsl_clients[i].ip}:${self.tsl_clients[i].port} (${self.tsl_clients[i].transport})`
					self.tsl_clients_array.push(tslClientObj)
				}
				self.initFeedbacks()
				self.checkFeedbacks('tsl_clients')
			})

			self.socket.on('cloud_destinations', function (data) {
				self.cloud_destinations = data

				self.cloud_destinations_array = [{ id: '0', label: '(Select a Cloud Destination)' }]
				for (let i = 0; i < self.cloud_destinations.length; i++) {
					let cloudDestinationObj = {}
					cloudDestinationObj.id = self.cloud_destinations[i].id
					cloudDestinationObj.label = `${self.cloud_destinations[i].host}:${self.cloud_destinations[i].port}`
					self.cloud_destinations_array.push(cloudDestinationObj)
				}
				self.initFeedbacks()
				self.checkFeedbacks('cloud_destinations')
			})

			self.socket.on('error', function (error) {
				self.updateStatus(InstanceStatus.ConnectionFailure)
				self.log('error', 'Error from Tally Arbiter: ' + error)
			})
		}
	},

	sendCommand(cmd, arg1 = null, arg2 = null, arg3 = null) {
		if (self.socket !== undefined) {
			if (self.config.verbose) {
				self.log('info', 'Sending: ' + cmd)
			}

			if (arg1 !== null) {
				if (arg2 !== null) {
					if (arg3 !== null) {
						self.socket.emit(cmd, arg1, arg2, arg3)
					} else {
						self.socket.emit(cmd, arg1, arg2)
					}
				} else {
					self.socket.emit(cmd, arg1)
				}
			} else {
				self.socket.emit(cmd)
			}
		} else {
			debug('Unable to send: Not connected to Tally Arbiter.')

			if (self.config.verbose) {
				self.log('warn', 'Unable to send: Not connected to Tally Arbiter.')
			}
		}
	},
}
