export interface ILoggerService {
    
    /**
     * Serializes message to file and console
     * @param message logged value
     */
    debug(message: string): void;
    /**
     * Serializes message and an object or array to file and console
     * @param message logged value
     * @param obj optional object or array to be JSONified 
     */
    debug(message: string, obj: unknown | unknown[]): void;

    /**
     * Serializes message to file and console
     * @param message logged value
     */
    info(message: string): void;
    /**
     * Serializes message and an object or array to file and console
     * @param message logged value
     * @param obj optional object or array to be JSONified 
     */
    info(message: string, obj: unknown | unknown[]): void;

    /**
     * Serializes message to file and console
     * @param message logged value
     */
    warn(message: string): void;
    /**
     * Serializes message and an object or array to file and console
     * @param message logged value
     * @param obj optional object or array to be JSONified 
     */
    warn(message: string, obj: unknown | unknown[]): void;

    /**
     * Serializes message to file and console
     * @param message logged value
     */
    error(message: string | Error): void;
        /**
     * Serializes message and an object or array to file and console
     * @param message logged value
     * @param obj optional object or array to be JSONified 
     */
    error(message: string | Error, obj: unknown | unknown[]): void;

}