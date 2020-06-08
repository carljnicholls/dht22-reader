import moment from 'moment';
import { TransformableInfo } from 'logform';
import { createLogger, format, Logger, LoggerOptions, loggers, transports } from 'winston';
import * as Transport from 'winston-transport';
import { FileTransportOptions } from 'winston/lib/winston/transports';
import { ILoggerService } from "../../interfaces/services/core/i-logger-service";

export class LoggerService implements ILoggerService {
    private readonly logger: Logger;

    /**
     * Declare transports for the logger
     */
    private readonly allLevelsToConsoleTransport: Transport = new transports.Console();
    private readonly ioTransport: Transport = new transports.File({
        level: 'debug',
        filename: `logs/${moment().format('DD-MM-YYYY')}.log`,
        format: format.combine(
            format.uncolorize(),
            format.timestamp(),
            format.printf(this.printTemplate())
        ),
    } as FileTransportOptions);

    private readonly defaultLoggerOptions: LoggerOptions = {
        level: 'debug', 
        format: format.combine(
            format.colorize(),
            format.timestamp(),
            format.printf(this.printTemplate()),
        )
    };

    constructor(isDev: boolean = false) {
        this.logger = createLogger(this.defaultLoggerOptions);

        /**
         * Add Console and IO Transports
         */
        this.logger.add(this.allLevelsToConsoleTransport);
        this.logger.add(this.ioTransport);
    }

    /**
     * Prints `message` to console
     * @param message Message to be logged
     */
    public debug(message: string, obj?: unknown | unknown[]): void {
        if(typeof obj !== "undefined") {
            this.logger.debug(message, obj);
            return;
        }
        
        this.logger.debug(message);
    }

    /**
     * Serializes message to file and console
     * @param message logged value
     */
    public info(message: string, obj?: unknown | unknown[]): void {
        if(typeof obj !== "undefined") {
            this.logger.info(message, obj);
            return;
        }
        
        this.logger.info(message);
    }

    /**
     * Serializes message to file and console
     * @param message logged value
     */
    public warn(message: string, obj?: unknown | unknown[]): void {
        if(typeof obj !== "undefined") {
            this.logger.warn(message, obj);
            return;
        }

        this.logger.warn(message);
    }

    /**
     * Serializes message to file and console
     * @param message logged value
     */
    public error(message: string | Error, obj?: unknown | unknown[]): void {
        let result: string;

        if (typeof message === 'string') {
            result = message;
        } else {
            result = JSON.stringify(message);
        }

        if(typeof obj !== "undefined") {
            this.logger.error(result, obj);
            return;
        }

        this.logger.error(result);
    }

    private printTemplate(): (info: TransformableInfo) => string {
        return (info: TransformableInfo) => {
            return `${moment(info.timestamp).format('HH:mm:ss')} [${info.level.toString()}]: ${JSON.stringify(info.message)} ${this.getMetaJsonString(info)}`;
        };
    }

    /**
     * Returns a JSON array string of any object keys that do not match `message`, `level` or `timestamp`.
     * @param info 
     */
    private getMetaJsonString(info: TransformableInfo): string {
        let args = Array<unknown>();

        Object.keys(info).forEach(element => {
            if(element == 'message'
                || element == 'level'
                || element == 'timestamp') return;
            args.push(info[element]);
        });

        return args != undefined && args.length > 0 
            ? JSON.stringify(args) 
            : '';;
    }
}