import { DotenvConfigOutput } from 'dotenv/types';
import { ILoggerService } from './interfaces/services/core/i-logger-service';
import { Dht22SensorReader } from './services/logger/dht22-sensor-reader';
import { SensorSettingsDto } from './data-transfer/dtos/sensor-settings.dto';

/**
 * Asynchronous Starting Point for Application
 */
export class App {

    constructor(
        private sensorReader: Dht22SensorReader | undefined,
        config: DotenvConfigOutput | undefined,
        private readonly logger: ILoggerService
    ) {
        if(config === undefined) throw 'Env variables are undefined';
        if(config.error) throw config.error;
    }

    /**
     * The Asynchronous Entry Point for the Application
     * @param args string array of arguments. 
     * First is command, anything after is omitted or used as additional params 
     */
    public async Run(): Promise<void> { 
        try{
            const settings = this.getSensorSettings();

            if(this.sensorReader == undefined) {
                this.sensorReader = new Dht22SensorReader(settings, this.logger);
            }

            this.logger.debug('App.Run() - start');
            await this.sensorReader.read();

        } catch(error) {
            if(this.sensorReader != undefined) {
                this.sensorReader.dispose();
            }

            this.logger.error('Application Error Catch: ', error);
            throw error;
        } finally {
            this.logger.debug('App.Run() - finish');
        }
    }

    private getSensorSettings() {
        const pin = process.env.DHT22_PIN;
        if (pin == undefined)
            throw new Error('DHT22_PIN env variable undefined');

        const sensorUrl = process.env.SENSOR_URL;
        if (sensorUrl == undefined)
            throw new Error('SENSOR_URL env variable undefined');
        const sensorTopic = process.env.SENSOR_TOPIC;

        if (sensorTopic == undefined)
            throw new Error('SENSOR_TOPIC env variable undefined');

        const sensorInterval = process.env.SENSOR_INTERVAL;
        let interval: number | undefined = undefined;
        if(sensorInterval !== undefined) {
            interval == Number.parseInt(sensorInterval, 10);
        }

        return {
            pin: Number.parseInt(pin),
            url: sensorUrl,
            topic: sensorTopic, 
            interval: interval
        } as SensorSettingsDto;
    }
}