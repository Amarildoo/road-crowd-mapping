import config from "config";
import logger from "./logger";

async function connect() {
    logger.info(config.get<String>("dbUri"))
    //todo: return db connection (with await)
    // on error, run 'process.exit(1)'
}

export default connect;