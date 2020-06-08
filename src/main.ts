import { config } from 'dotenv';
import { LoggerService } from "./services/logger/logger-service";

import { App } from "./app";

// Set up dependencies 
const env = config();
const logger = new LoggerService();  

const app = new App(undefined, env, logger);

// Execute App
app.Run()
    .catch((ex: Error) => {
        logger.error(`Global Error: `, ex);
    });
