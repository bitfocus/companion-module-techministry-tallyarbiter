## TechMinistry-TallyArbiter

This module will allow you to view tally data available on your Tally Arbiter server (as feedbacks on buttons) and send a flash command to any connected listener client/device.

To learn more about the Tally Arbiter project, visit the main repository at <http://www.github.com/josephdadams/tallyarbiter>.

### Configuration
* The remote device must be running the Tally Arbiter server.
* The software can be downloaded from <http://www.github.com/josephdadams/tallyarbiter>.
* Configure the instance with the IP address of the remote machine.
* The module makes HTTP requests over port 4455 by default.

### To use the module
Add an action to a button and choose the action you wish to use.

**Available Actions:**
* Flash All Listener Clients of a Device
* Flash A Specific Listener Client

**Available Feedbacks:**
* A tally source is online/offline
* The selected device is in preview or program
* A Listener Client has disconnected
* A TSL Client has disconnected
* A Cloud Destination has disconnected