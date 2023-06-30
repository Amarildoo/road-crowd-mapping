import logger from 'pino';
const pretty = require('pino-pretty')
import dayjs from "dayjs";

//config pino logger
const log = logger({
    base: {
        pid: false,
        timestamp: () => `,"time":"${dayjs().format()}"`
    },
    timestamp: () => `,"time":"${dayjs().format()}"`,
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
});

export default log;