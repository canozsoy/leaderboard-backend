import mongoose from 'mongoose';
import mongoConfig from 'src/config/mongo-config.js';

class MongoRepository {
    constructor(mongoConfiguration) {
        this.mongoUrl = mongoConfiguration?.url;
        this.mongoClient = mongoose;
    }

    async connect() {
        await this.mongoClient.connect(this.mongoUrl);
    }

    async disconnect() {
        await this.mongoClient.disconnect();
    }

    createSchema(modelName, blueprint) {
        return new this.mongoClient.Schema(blueprint, { versionKey: false });
    }

    createModel(modelName, blueprint) {
        const schema = this.createSchema(modelName, blueprint);
        return this.mongoClient.model(modelName, schema);
    }
}

export default new MongoRepository(mongoConfig);
