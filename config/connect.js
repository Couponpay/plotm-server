import Mongoose from 'mongoose';
import config from './config';
Mongoose.Promise = global.Promise;
const connectToDb = async () => {
    let MongoURL = config.MongoURL;
    let options = {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }
    try {
        await Mongoose.connect(MongoURL, options);
        console.log(`Connected to mongo db--->${MongoURL}`);
    }
    catch (error) {
        console.error('Could not connect to MongoDB');
        console.error(error);
    }
}

export default connectToDb;