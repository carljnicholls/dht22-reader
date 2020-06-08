import { ILoggerService } from '../../interfaces/services/core/i-logger-service';
import { SensorSettingsDto } from '../../data-transfer/dtos/sensor-settings.dto';
import * as mqtt from 'mqtt';

var sensor = require("node-dht-sensor").promises; 
// sensor.initialize({
//     test: {
//       fake: {
//         temperature: 21,
//         humidity: 60
//       }
//     }
//   });


export class Dht22SensorReader {
    private readonly className: string = `Dht22SensorReader`;
    private readonly sensorType = 22; 
    private intervalTimeout = 5000;
    private intervalCallback: NodeJS.Timeout | undefined;
    
    constructor(
        private readonly settings: SensorSettingsDto,
        private readonly logger: ILoggerService) {
    }

    /**
     * Starts polling the sensor at an interval and pushing the result to a MQTT broker
     */
    public async read(): Promise<void> {
        this.logger.debug(`${this.className}.read`, this.settings);

        if(this.settings.interval !== undefined) {
            this.intervalTimeout = this.settings.interval;
        }

        const client = mqtt.connect(this.settings.url);

        try {
            client.on('connect', async () => {
                this.logger.debug(`${this.className}.push.connect`);

                client.subscribe(
                    this.settings.topic, 
                    async (error: Error) => this.onSubscribeToClient(error, client)
                );
            });

        } catch (error) {
            this.logger.error(`${this.className}.read.error`, error); 
            throw error;
        }
    }

    /**
     * Clear recurring check of sensor
     */
    public dispose(): void {
        if(this.intervalCallback == undefined) return;
        
        clearTimeout(this.intervalCallback);
    }

    /** 
     * Checks error and sets an interval for sensor checks and publishing results
    */
    private async onSubscribeToClient(error: Error, client: mqtt.Client): Promise<void> {
        this.logger.debug(`${this.className}.push.connect.subscribe`);

        if(error != undefined) {
            this.logger.error(`Error subscribing to topic ${this.settings.topic}`, error)
            return;
        }

        this.intervalCallback = setInterval(async () => this.onInterval(client), this.intervalTimeout);
    }

    /**
     * Reads the sensor and publishes its response to mqtt broker
     */
    private async onInterval(client: mqtt.Client): Promise<void> {
        this.logger.debug(`${this.className}.push.connect.subscribe.setInterval`);
        const result = await sensor.read(this.sensorType, this.settings.pin) as SensorMessageDto;
        
        const mqttMessage = JSON.stringify(result);
        this.logger.info(`${this.className}.push.connect.subscribe.publish`, mqttMessage);
        client.publish(this.settings.topic, mqttMessage);
    }
}
