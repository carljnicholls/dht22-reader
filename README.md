# DHT22 Reader

This Service is part of a collection running on a Raspberry Pi. It reads from a DHT22 sensor periodically and and publishes the response to a MQTT broker.

## Run

### From root

1. Install dependencies: `npm i`
1. Build: `tsc -b`
1. Set Environnement settings by either creating  `/.env` from `/.example.env` or set with run command.
1. Run: `node .\build\src\main.js`
