import mongoose from "mongoose";
import debug from "debug";

const log: debug.IDebugger = debug("app:mongoose-service");

/**
 * Options: 
 *  - useNewUrlParser: supress deprecation warning
 *  - useUnifiedTopology: rec from docs
 *  - serverSelectionTimeoutMS: set timeout
 *  - useFindAndModify: supress deprecation warning
 */
class MongooseService {
  private count = 0;
  private mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    useFindAndModify: false,
  };

  constructor() {
    this.connectWithRetry();
  }

  getMongoose() {
    return mongoose;
  }

  // in a singleton constructor will be run once
  connectWithRetry = () => {
    log("Attempting MongoDB connection (will retry if needed)");
    
    // this connects to local service 
    mongoose
      .connect("mongodb://localhost:27017/api-db", this.mongooseOptions)
      .then(() => {
        log("MongoDB is connected");
      })
      .catch((err) => {
        const retrySeconds = 5;
        log(
          `MongoDB connection unsuccessful (will retry #${++this
            .count} after ${retrySeconds} seconds):`,
          err
        );
        setTimeout(this.connectWithRetry, retrySeconds * 1000);
      });
  };
}
export default new MongooseService();
