import mongoRepo from 'src/repositories/mongo-repository.js';

const userSchema = {
    name: {
        type: String,
        required: true,
    },
    money: {
        type: Number,
        default: 0,
    },
    country: {
        type: String,
        required: true,
    },
};

export default mongoRepo.createModel('User', userSchema);
