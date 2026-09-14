## TechMinistry-TallyArbiter

This module will allow you to view tally data available on your Tally Arbiter server (as feedbacks on buttons) and send a flash command to any connected listener client/device.

To learn more about the Tally Arbiter project, visit the main repository at <http://www.github.com/josephdadams/tallyarbiter>.

### Configuration

- The remote device must be running the Tally Arbiter server.
- The software can be downloaded from <http://www.github.com/josephdadams/tallyarbiter>.
- Configure the instance with the IP address of the remote machine.
- The module makes HTTP requests over port 4455 by default.
- **Tally Arbiter 3.3 and later require a login.** Create a dedicated Tally Arbiter user with the
  "producer" role for this connection (Settings → Users in the Tally Arbiter web UI) rather than
  reusing an "admin" account — this module stores the password in Companion's configuration, so a
  producer-only account limits what could be done with it if that configuration were ever exposed.
  Make sure the account's password has already been changed from the default, then enter that
  username/password in the module configuration. Leave both fields blank when connecting to a
  Tally Arbiter server older than 3.3.

### To use the module

Add an action to a button and choose the action you wish to use.

**Available Actions:**

- Flash All Listener Clients of a Device
- Flash A Specific Listener Client
- Reassign A Specific Listener Client

**Available Variables:**

- Total Sources
- Total Devices
- Total Listener Clients
- Total TSL Clients
- Total Cloud Destinations
- Name of each Source
- Name of each Device

**Available Feedbacks:**

- A tally source is online/offline
- The selected device is in preview or program
- The selected Device is in the selected Bus
- The selected Bus has an active device
- A Listener Client has disconnected
- A TSL Client has disconnected
- A Cloud Destination has disconnected

**Available Presets:**

- Feedback for each Device with Preview and Program status
- Flash a Device
- Flash a Listener Client
- Reassign a Listener Client
- Status of each Source
- Status of each Bus, showing which device(s) are currently active on it
- Status of each Listener Client, TSL Client, and Cloud Destination
