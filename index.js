// techministry-tallyarbiter

const { InstanceBase, InstanceStatus, Regex, runEntrypoint } = require('@companion-module/base')
const UpgradeScripts = require('./src/upgrades')

const config = require('./src/config')
const actions = require('./src/actions')
const feedbacks = require('./src/feedbacks')
const variables = require('./src/variables')
const presets = require('./src/presets')

const utils = require('./src/utils')

const io = require('socket.io-client')

class tallyarbiterInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			...config,
			...actions,
			...feedbacks,
			...variables,
			...presets,
			...utils,
		})

		this.socket = null

		this.sources_array = [{ id: '0', label: '(Select a Source)' }]

		this.devices_array = [{ id: '0', label: 'No Devices Found' }]

		this.sources = []
		this.devices = []
		this.bus_options = []
		this.CHOICES_BUS_OPTIONS = [{ id: '0', label: '(no bus options available)' }]

		this.listener_clients = []
		this.cloud_destinations = []
		this.tsl_clients = []
	}

	async destroy() {
		if (this.socket) {
			this.socket.close()
			this.socket = null
		}
	}

	async init(config) {
		this.updateStatus(InstanceStatus.Connecting)
		this.configUpdated(config)
	}

	async configUpdated(config) {
		this.config = config

		if (this.config.verbose) {
			this.log('info', 'Verbose mode enabled. Log entries will contain detailed information.')
		}

		this.updateStatus(InstanceStatus.Connecting)

		this.initConnection()

		this.initActions()
		this.initFeedbacks()
		this.initVariables()
		this.initPresets()

		this.checkFeedbacks()
		this.checkVariables()
	}

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

		if (this.config.host) {
			this.log('info', `Opening connection to Tally Arbiter: ${this.config.host}:${this.config.port}`)

			this.socket = io.connect('http://' + this.config.host + ':' + this.config.port, { reconnection: true })

			// Add listeners
			this.socket.on('connect', function () {
				self.log('info', 'Connected to Tally Arbiter. Retrieving data.')
				self.updateStatus(InstanceStatus.Ok)
				self.socket.emit('companion')
			})

			this.socket.on('disconnect', function () {
				self.updateStatus(InstanceStatus.ConnectionFailure)
				self.log('error', 'Disconnected from Tally Arbiter.')
				self.checkVariables()
			})

			this.socket.on('version', function (version) {
				self.STATUS.version = version
				self.checkVariables()
			})

			this.socket.on('sources', function (data) {
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

			this.socket.on('devices', function (data) {
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

			this.socket.on('bus_options', function (data) {
				console.log('got bus options', data)
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
			})

			this.socket.on('device_sources', function (data) {
				self.device_sources = data
			})

			this.socket.on('device_states', function (data) {
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
			})

			this.socket.on('listener_clients', function (data) {
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

			this.socket.on('tsl_clients', function (data) {
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

			this.socket.on('cloud_destinations', function (data) {
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

			this.socket.on('error', function (error) {
				self.updateStatus(InstanceStatus.ConnectionFailure)
				self.log('error', 'Error from Tally Arbiter: ' + error)
			})
		}
	}

	sendCommand(cmd, arg1 = null, arg2 = null, arg3 = null) {
		if (this.socket !== undefined) {
			if (this.config.verbose) {
				this.log('info', 'Sending: ' + cmd)
			}

			if (arg1 !== null) {
				if (arg2 !== null) {
					if (arg3 !== null) {
						this.socket.emit(cmd, arg1, arg2, arg3)
					} else {
						this.socket.emit(cmd, arg1, arg2)
					}
				} else {
					this.socket.emit(cmd, arg1)
				}
			} else {
				this.socket.emit(cmd)
			}
		} else {
			debug('Unable to send: Not connected to Tally Arbiter.')

			if (this.config.verbose) {
				this.log('warn', 'Unable to send: Not connected to Tally Arbiter.')
			}
		}
	}
}

runEntrypoint(tallyarbiterInstance, UpgradeScripts)
