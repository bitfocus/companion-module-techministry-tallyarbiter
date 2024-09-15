// techministry-tallyarbiter

const { InstanceBase, InstanceStatus, Regex, runEntrypoint } = require('@companion-module/base')
const UpgradeScripts = require('./src/upgrades')

const config = require('./src/config')
const actions = require('./src/actions')
const feedbacks = require('./src/feedbacks')
const variables = require('./src/variables')
const presets = require('./src/presets')

const api = require('./src/api')
const utils = require('./src/utils')

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
			...api,
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
}

runEntrypoint(tallyarbiterInstance, UpgradeScripts)
