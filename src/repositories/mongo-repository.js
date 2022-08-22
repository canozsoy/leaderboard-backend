import mongoose from 'mongoose';
import mongoConfig from 'src/config/mongo-config.js';

class MongoRepository {
    constructor(mongoConfiguration) {
        this.mongoUrl = mongoConfiguration?.url;
        this.mongoClient = mongoose;
    }

    async connect() {
        this.mongoClient.connect(this.mongoUrl);
    }

    async disconnect() {
        this.mongoClient.disconnect();
    }

    async createSchema(modelName, blueprint) {
        return new this.mongoClient.Schema(blueprint);
    }

    async createModel(modelName, blueprint) {
        const schema = this.createSchema(modelName, blueprint);
        return this.mongoClient.model(modelName, schema);
    }
}

export default new MongoRepository(mongoConfig);
